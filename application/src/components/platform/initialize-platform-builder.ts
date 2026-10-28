import type { PlatformApproachId, PlatformStageId, PlatformWorkflowContent } from '~/data/platform-workflow';

type PlatformSelection = Map<PlatformStageId, Set<string>>;
type DraggedTechnology = { stageId: PlatformStageId; technologyId: string };

export function initializePlatformBuilders(): void {
  document.querySelectorAll<HTMLElement>('[data-platform-builder]').forEach((root) => {
    if (root.dataset.initialized === 'true') return;

    const contentElement = root.querySelector<HTMLScriptElement>('[data-builder-content]');
    if (!contentElement?.textContent) return;

    let content: PlatformWorkflowContent;
    try {
      content = JSON.parse(contentElement.textContent);
    } catch {
      return;
    }
    if (!Array.isArray(content?.stages) || !content.stages.length || !Array.isArray(content.approaches)) return;

    const stageButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-builder-stage]'));
    if (stageButtons.length !== content.stages.length) return;

    const stageById = new Map(content.stages.map((stage) => [stage.id, stage]));
    const technologyButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-add-technology]'));
    const placedTechnologies = Array.from(root.querySelectorAll<HTMLElement>('[data-placed-technology]'));
    const removeButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-remove-technology]'));
    const paletteGroups = Array.from(root.querySelectorAll<HTMLElement>('[data-palette-stage]'));
    const detailPanels = Array.from(root.querySelectorAll<HTMLElement>('[data-builder-detail]'));
    const connectionDetail = root.querySelector<HTMLElement>('[data-connection-detail]');
    const connectionButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-builder-connection]'));
    const edges = Array.from(root.querySelectorAll<SVGElement>('[data-builder-edge]'));
    const dropAreas = Array.from(root.querySelectorAll<HTMLElement>('[data-stage-drop]'));
    const emptyHints = Array.from(root.querySelectorAll<HTMLElement>('[data-stage-empty]'));
    const presetButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-builder-preset]'));
    const board = root.querySelector<HTMLElement>('.builder-board');
    const wires = root.querySelector<SVGSVGElement>('.builder-wires');
    const canvasScroller = root.querySelector<HTMLElement>('.builder-canvas-scroll');
    const library = root.querySelector<HTMLElement>('.builder-library');
    const libraryTools = root.querySelector<HTMLElement>('[data-builder-library-tools]');
    const collapseButton = root.querySelector<HTMLButtonElement>('[data-builder-collapse]');
    const stackedWorkspace = window.matchMedia('(max-width: 899px)');
    const status = root.querySelector<HTMLElement>('[data-builder-status]');
    const isEnglish = root.dataset.lang === 'en';
    const translate = (fr: string, en: string) => (isEnglish ? en : fr);
    const selections: PlatformSelection = new Map(content.stages.map((stage) => [stage.id, new Set<string>()]));
    let selectedStage = content.stages[0];
    let selectedConnection: PlatformStageId | undefined;
    let hoveredConnection: PlatformStageId | undefined;
    let focusedConnection: PlatformStageId | undefined;
    let selectedPreset: PlatformApproachId | 'custom' = 'composable';
    let draggedTechnology: DraggedTechnology | undefined;
    let geometryFrame: number | undefined;

    const setText = (selector: string, value: string) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.textContent = value;
      });
    };
    const announce = (message: string) => {
      if (status) status.textContent = message;
    };
    const stageSelection = (stageId: string | undefined) => selections.get(stageId as PlatformStageId);
    const revealStage = (stageId: string | undefined) => {
      const area = dropAreas.find((item) => item.dataset.stageDrop === stageId);
      if (!canvasScroller || !area) return;
      const canvasBounds = canvasScroller.getBoundingClientRect();
      const areaBounds = area.getBoundingClientRect();
      const overflowLeft = areaBounds.left - canvasBounds.left;
      const overflowRight = areaBounds.right - canvasBounds.right;
      const offset = overflowLeft < 0 ? overflowLeft - 16 : overflowRight > 0 ? overflowRight + 16 : 0;
      if (offset) canvasScroller.scrollBy({ left: offset, behavior: 'instant' });
    };

    const updateConnectionGeometry = () => {
      if (!board || !wires || !root.isConnected) return;
      const bounds = board.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      wires.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);

      connectionButtons.forEach((button) => {
        const sourceArea = dropAreas.find((area) => area.dataset.stageDrop === button.dataset.builderConnection);
        const targetArea = dropAreas.find((area) => area.dataset.stageDrop === button.dataset.targetStage);
        const sourcePort = sourceArea?.querySelector<HTMLElement>('.module-port-out')?.getBoundingClientRect();
        const targetPort = targetArea?.querySelector<HTMLElement>('.module-port-in')?.getBoundingClientRect();
        const edge = edges.find((item) => item.dataset.builderEdge === button.dataset.builderConnection);
        if (!sourcePort || !targetPort || !edge) return;

        const sourceX = sourcePort.left + sourcePort.width / 2 - bounds.left;
        const sourceY = sourcePort.top + sourcePort.height / 2 - bounds.top;
        const targetX = targetPort.left + targetPort.width / 2 - bounds.left;
        const targetY = targetPort.top + targetPort.height / 2 - bounds.top;
        const midpointY = (sourceY + targetY) / 2;
        const vertical = button.dataset.builderConnection === 'build' || button.dataset.builderConnection === 'observe';
        const midpointX = vertical
          ? button.dataset.builderConnection === 'build'
            ? Math.max(sourceX, targetX) + 24
            : Math.min(sourceX, targetX) - 24
          : (sourceX + targetX) / 2;
        const distanceY = targetY - sourceY;
        const path = vertical
          ? `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + distanceY * 0.22}, ${midpointX} ${midpointY - distanceY * 0.18}, ${midpointX} ${midpointY} C ${midpointX} ${midpointY + distanceY * 0.18}, ${targetX} ${targetY - distanceY * 0.22}, ${targetX} ${targetY}`
          : `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
        edge.querySelectorAll<SVGPathElement>('.wire-line, .wire-underlay, .wire-pulse, .wire-hit').forEach((line) => {
          line.setAttribute('d', path);
        });

        const deltaX = vertical ? 0 : targetX - sourceX;
        const deltaY = vertical ? distanceY : targetY - sourceY;
        const length = Math.hypot(deltaX, deltaY);
        if (length) {
          const directionX = deltaX / length;
          const directionY = deltaY / length;
          const tipX = targetX - directionX * 8;
          const tipY = targetY - directionY * 8;
          const baseX = tipX - directionX * 6;
          const baseY = tipY - directionY * 6;
          edge
            .querySelector<SVGPathElement>('.wire-arrow')
            ?.setAttribute(
              'd',
              `M ${baseX - directionY * 3.5} ${baseY + directionX * 3.5} L ${tipX} ${tipY} L ${baseX + directionY * 3.5} ${baseY - directionX * 3.5}`
            );
        }
        button.style.setProperty('--edge-x', `${midpointX}px`);
        button.style.setProperty('--edge-y', `${midpointY}px`);
      });
    };
    const scheduleConnectionGeometry = () => {
      if (geometryFrame !== undefined) return;
      geometryFrame = window.requestAnimationFrame(() => {
        geometryFrame = undefined;
        updateConnectionGeometry();
      });
    };
    const renderConnectionPreview = () => {
      const preview = hoveredConnection ?? focusedConnection;
      const target = connectionButtons.find((button) => button.dataset.builderConnection === preview)?.dataset
        .targetStage;
      connectionButtons.forEach((button) => {
        button.dataset.preview = String(button.dataset.builderConnection === preview);
      });
      edges.forEach((edge) => {
        edge.dataset.preview = String(edge.dataset.builderEdge === preview);
      });
      dropAreas.forEach((area) => {
        area.dataset.connectionPreviewRole =
          area.dataset.stageDrop === preview ? 'source' : area.dataset.stageDrop === target ? 'target' : '';
        area.dataset.connectionPreview = String(
          Boolean(preview) && (area.dataset.stageDrop === preview || area.dataset.stageDrop === target)
        );
      });
    };

    const renderConnections = () => {
      connectionButtons.forEach((button) => {
        const sourceId = button.dataset.builderConnection as PlatformStageId;
        const targetId = button.dataset.targetStage as PlatformStageId;
        const connected = Boolean(selections.get(sourceId)?.size && selections.get(targetId)?.size);
        button.dataset.connected = String(connected);
        button.setAttribute('aria-pressed', String(selectedConnection === sourceId));
        button.setAttribute('aria-expanded', String(selectedConnection === sourceId));
        edges
          .filter((edge) => edge.dataset.builderEdge === sourceId)
          .forEach((edge) => {
            edge.dataset.connected = String(connected);
            edge.dataset.active = String(selectedConnection === sourceId);
          });
      });

      const activeConnection = connectionButtons.find(
        (button) => button.dataset.builderConnection === selectedConnection
      );
      dropAreas.forEach((area) => {
        area.dataset.connectionRole =
          area.dataset.stageDrop === selectedConnection
            ? 'source'
            : area.dataset.stageDrop === activeConnection?.dataset.targetStage
              ? 'target'
              : '';
        area.dataset.connectionEndpoint = String(
          Boolean(selectedConnection) &&
            (area.dataset.stageDrop === selectedConnection ||
              area.dataset.stageDrop === activeConnection?.dataset.targetStage)
        );
      });

      if (libraryTools) libraryTools.hidden = Boolean(selectedConnection);
      if (connectionDetail) connectionDetail.hidden = !selectedConnection;
      if (!selectedConnection) {
        delete root.dataset.selectedConnection;
        return;
      }

      root.dataset.selectedConnection = selectedConnection;
      const source = stageById.get(selectedConnection);
      const connection = connectionButtons.find((button) => button.dataset.builderConnection === selectedConnection);
      const target = stageById.get(connection?.dataset.targetStage as PlatformStageId);
      if (!source || !target) return;

      setText('[data-connection-source]', source.label);
      setText('[data-connection-target]', target.label);
      setText(
        '[data-connection-title]',
        connection?.querySelector('[data-connection-label]')?.textContent?.trim() ?? source.output
      );
      setText('[data-connection-description]', source.handoff);
      const configured = Boolean(selections.get(source.id)?.size && selections.get(target.id)?.size);
      if (connectionDetail) connectionDetail.dataset.configured = String(configured);
      setText(
        '[data-connection-state]',
        configured
          ? translate('Étapes configurées', 'Stages configured')
          : translate('Ajoutez des technologies aux deux étapes', 'Add technologies to both stages')
      );
      const endpoints = [
        ['source', source],
        ['target', target],
      ] as const;
      endpoints.forEach(([role, stage]) => {
        const endpoint = connectionDetail?.querySelector<HTMLElement>(`[data-connection-endpoint="${role}"]`);
        endpoint?.querySelectorAll<HTMLElement>('[data-connection-stage]').forEach((section) => {
          section.hidden = section.dataset.connectionStage !== stage.id;
          section.querySelectorAll<HTMLElement>('[data-connection-technology]').forEach((technology) => {
            technology.hidden = !selections.get(stage.id)?.has(technology.dataset.connectionTechnology ?? '');
          });
        });
        endpoint?.querySelectorAll<HTMLElement>('[data-connection-empty]').forEach((empty) => {
          empty.hidden = Boolean(selections.get(stage.id)?.size);
        });
      });
    };

    const closeConnection = () => {
      if (!selectedConnection) return;
      const button = connectionButtons.find((item) => item.dataset.builderConnection === selectedConnection);
      selectedConnection = undefined;
      renderConnections();
      button?.focus({ preventScroll: true });
      announce(
        translate(
          `Technologies disponibles : ${selectedStage.label}.`,
          `Available technologies: ${selectedStage.label}.`
        )
      );
    };

    const renderStage = () => {
      root.dataset.selectedStage = selectedStage.id;
      stageButtons.forEach((button) => {
        const active = button.dataset.builderStage === selectedStage.id;
        button.setAttribute('aria-pressed', String(active));
        button.dataset.active = String(active);
      });
      dropAreas.forEach((area) => {
        area.dataset.active = String(area.dataset.stageDrop === selectedStage.id);
      });
      paletteGroups.forEach((group) => {
        group.hidden = group.dataset.paletteStage !== selectedStage.id;
      });
      detailPanels.forEach((panel) => {
        panel.hidden = panel.dataset.builderDetail !== selectedStage.id;
      });
      setText('[data-palette-title]', selectedStage.label);
      setText('[data-palette-outcome]', selectedStage.outcome);
      renderConnections();
      scheduleConnectionGeometry();
    };

    const selectStage = (stageId: string | undefined, moveFocus = false, announceChange = true) => {
      const stage = stageById.get(stageId as PlatformStageId);
      if (!stage) return;
      selectedStage = stage;
      selectedConnection = undefined;
      renderStage();
      if (moveFocus) {
        stageButtons.find((button) => button.dataset.builderStage === stage.id)?.focus({ preventScroll: true });
      }
      revealStage(stage.id);
      if (announceChange) announce(`${stage.label}. ${stage.outcome}`);
    };

    const renderPlacement = () => {
      let total = 0;
      let coverage = 0;
      selections.forEach((selected, stageId) => {
        total += selected.size;
        if (selected.size) coverage += 1;
        setText(`[data-stage-count="${stageId}"]`, String(selected.size));
      });
      setText('[data-builder-count]', String(total));
      setText('[data-builder-coverage]', `${coverage} / ${content.stages.length}`);
      root.dataset.preset = selectedPreset;
      const presetLabel =
        content.approaches.find((approach) => approach.id === selectedPreset)?.label ??
        translate('Personnalisée', 'Custom');
      setText('[data-builder-preset-name]', presetLabel);
      presetButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.builderPreset === selectedPreset));
      });
      technologyButtons.forEach((button) => {
        const placed = stageSelection(button.dataset.stage)?.has(button.dataset.addTechnology ?? '') ?? false;
        button.setAttribute('aria-pressed', String(placed));
        button.dataset.placed = String(placed);
        const action = button.querySelector<HTMLElement>('[data-technology-action]');
        if (action) action.textContent = placed ? translate('Ajoutée', 'Added') : translate('Ajouter', 'Add');
      });
      placedTechnologies.forEach((chip) => {
        chip.hidden = !stageSelection(chip.dataset.stage)?.has(chip.dataset.placedTechnology ?? '');
      });
      emptyHints.forEach((hint) => {
        hint.hidden = Boolean(stageSelection(hint.dataset.stageEmpty)?.size);
      });
      renderConnections();
      scheduleConnectionGeometry();
    };

    const changeTechnology = (stageId: string | undefined, technologyId: string | undefined, placed: boolean) => {
      const stage = stageById.get(stageId as PlatformStageId);
      const technology = stage?.technologies.find((item) => item.id === technologyId);
      const selected = stageSelection(stageId);
      if (!stage || !technology || !selected || selected.has(technology.id) === placed) return;

      if (placed) selected.add(technology.id);
      else selected.delete(technology.id);
      selectedPreset = 'custom';
      renderPlacement();
      announce(
        placed
          ? translate(
              `${technology.name} ajouté à l’étape "${stage.label}".`,
              `${technology.name} added to ${stage.label}.`
            )
          : translate(
              `${technology.name} retiré de l’étape "${stage.label}".`,
              `${technology.name} removed from ${stage.label}.`
            )
      );
    };

    const applyPreset = (presetId: string | undefined, announceChange = true) => {
      const preset = content.approaches.find((approach) => approach.id === presetId);
      if (!preset) return;
      content.stages.forEach((stage) => {
        const validIds = new Set(stage.technologies.map((technology) => technology.id));
        selections.set(stage.id, new Set(stage.approaches[preset.id].technologyIds.filter((id) => validIds.has(id))));
      });
      selectedPreset = preset.id;
      selectedConnection = undefined;
      renderPlacement();
      renderStage();
      if (announceChange) {
        announce(translate(`Exemple chargé : ${preset.label}.`, `${preset.label} example loaded.`));
      }
    };

    const endDrag = () => {
      draggedTechnology = undefined;
      delete root.dataset.dragging;
      dropAreas.forEach((area) => {
        delete area.dataset.dropTarget;
        delete area.dataset.dropAllowed;
      });
    };

    const setLibraryCollapsed = (collapsed: boolean) => {
      root.dataset.libraryCollapsed = String(collapsed);
      if (collapseButton) {
        collapseButton.setAttribute('aria-expanded', String(!collapsed));
        const label = collapseButton.querySelector<HTMLElement>('.builder-collapse-label');
        if (label) label.textContent = collapsed ? translate('Déplier', 'Expand') : translate('Replier', 'Collapse');
      }
      scheduleConnectionGeometry();
    };
    const expandLibrary = () => {
      if (root.dataset.libraryCollapsed === 'true') setLibraryCollapsed(false);
    };
    const focusStageLibrary = (stageId: string | undefined) => {
      expandLibrary();
      technologyButtons.find((option) => option.dataset.stage === stageId)?.focus({ preventScroll: true });
      library?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
    };

    stageButtons.forEach((button, index) => {
      button.disabled = false;
      button.addEventListener('focus', () => revealStage(button.dataset.builderStage));
      button.addEventListener('click', () => {
        selectStage(button.dataset.builderStage);
        expandLibrary();
        if (!stackedWorkspace.matches) return;
        technologyButtons.find((option) => option.dataset.stage === selectedStage.id)?.focus({ preventScroll: true });
        library?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
      });
      button.addEventListener('keydown', (event) => {
        let targetIndex: number;
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            targetIndex = (index - 1 + stageButtons.length) % stageButtons.length;
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            targetIndex = (index + 1) % stageButtons.length;
            break;
          case 'Home':
            targetIndex = 0;
            break;
          case 'End':
            targetIndex = stageButtons.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        selectStage(stageButtons[targetIndex].dataset.builderStage, true);
      });
    });

    technologyButtons.forEach((button) => {
      button.disabled = false;
      button.draggable = true;
      button.addEventListener('click', () => {
        const placed = stageSelection(button.dataset.stage)?.has(button.dataset.addTechnology ?? '') ?? false;
        changeTechnology(button.dataset.stage, button.dataset.addTechnology, !placed);
      });
      button.addEventListener('dragstart', (event) => {
        const stage = stageById.get(button.dataset.stage as PlatformStageId);
        const technologyId = button.dataset.addTechnology;
        if (!stage || !technologyId || !stage.technologies.some((technology) => technology.id === technologyId)) return;
        draggedTechnology = { stageId: stage.id, technologyId };
        selectStage(stage.id, false, false);
        root.dataset.dragging = stage.id;
        dropAreas.forEach((area) => {
          area.dataset.dropAllowed = String(area.dataset.stageDrop === stage.id);
        });
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'copy';
          event.dataTransfer.setData('application/x-hoverkraft-platform-technology', JSON.stringify(draggedTechnology));
          event.dataTransfer.setData('text/plain', technologyId);
        }
      });
      button.addEventListener('dragend', endDrag);
    });

    emptyHints.forEach((hint) => {
      const button = hint as HTMLButtonElement;
      if (button.tagName !== 'BUTTON') return;
      button.disabled = false;
      button.addEventListener('click', () => {
        const stageId = button.dataset.stageEmpty;
        selectStage(stageId, false, false);
        focusStageLibrary(stageId);
        const stage = stageById.get(stageId as PlatformStageId);
        if (stage) {
          announce(
            translate(
              `Technologies disponibles pour l’étape "${stage.label}".`,
              `Available technologies for ${stage.label}.`
            )
          );
        }
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const stageId = button.dataset.stage;
        const technologyId = button.dataset.removeTechnology;
        selectStage(stageId, false, false);
        changeTechnology(stageId, technologyId, false);
        technologyButtons
          .find((option) => option.dataset.stage === stageId && option.dataset.addTechnology === technologyId)
          ?.focus({ preventScroll: true });
      });
    });

    dropAreas.forEach((area) => {
      area.addEventListener('dragover', (event) => {
        if (!draggedTechnology || area.dataset.stageDrop !== draggedTechnology.stageId) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
        area.dataset.dropTarget = 'true';
      });
      area.addEventListener('dragleave', (event) => {
        if (event.relatedTarget instanceof Node && area.contains(event.relatedTarget)) return;
        delete area.dataset.dropTarget;
      });
      area.addEventListener('drop', (event) => {
        if (!draggedTechnology || area.dataset.stageDrop !== draggedTechnology.stageId) return;
        event.preventDefault();
        changeTechnology(draggedTechnology.stageId, draggedTechnology.technologyId, true);
        endDrag();
      });
    });

    connectionButtons.forEach((button) => {
      const sourceId = button.dataset.builderConnection as PlatformStageId;
      const previewTargets = [
        button,
        edges.find((edge) => edge.dataset.builderEdge === sourceId)?.querySelector('.wire-hit'),
      ];
      previewTargets.forEach((target) => {
        target?.addEventListener('pointerenter', () => {
          hoveredConnection = sourceId;
          renderConnectionPreview();
        });
        target?.addEventListener('pointerleave', () => {
          if (hoveredConnection === sourceId) hoveredConnection = undefined;
          renderConnectionPreview();
        });
      });
      button.addEventListener('focus', () => {
        focusedConnection = sourceId;
        renderConnectionPreview();
      });
      button.addEventListener('blur', () => {
        if (focusedConnection === sourceId) focusedConnection = undefined;
        renderConnectionPreview();
      });
      edges
        .find((edge) => edge.dataset.builderEdge === sourceId)
        ?.querySelector('.wire-hit')
        ?.addEventListener('click', () => {
          button.focus({ preventScroll: true });
          button.click();
        });
      button.addEventListener('click', () => {
        if (selectedConnection === sourceId) {
          closeConnection();
          return;
        }
        const source = stageById.get(button.dataset.builderConnection as PlatformStageId);
        const target = stageById.get(button.dataset.targetStage as PlatformStageId);
        if (!source || !target) return;
        expandLibrary();
        selectedStage = source;
        renderStage();
        selectedConnection = source.id;
        renderConnections();
        if (stackedWorkspace.matches) {
          connectionDetail?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
        }
        announce(`${source.label} → ${target.label}. ${source.handoff}`);
      });
    });
    root
      .querySelector<HTMLButtonElement>('[data-builder-close-connection]')
      ?.addEventListener('click', closeConnection);
    root.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !selectedConnection) return;
      event.preventDefault();
      closeConnection();
    });
    presetButtons.forEach((button) => {
      button.addEventListener('click', () => applyPreset(button.dataset.builderPreset));
    });
    setLibraryCollapsed(false);
    collapseButton?.addEventListener('click', () => {
      const collapsed = root.dataset.libraryCollapsed !== 'true';
      setLibraryCollapsed(collapsed);
      announce(
        collapsed
          ? translate('Panneau des technologies replié.', 'Technologies panel collapsed.')
          : translate('Panneau des technologies déplié.', 'Technologies panel expanded.')
      );
    });
    root.querySelector<HTMLButtonElement>('[data-builder-return]')?.addEventListener('click', () => {
      const button = stageButtons.find((item) => item.dataset.builderStage === selectedStage.id);
      button?.focus({ preventScroll: true });
      revealStage(selectedStage.id);
      root.querySelector<HTMLElement>('.builder-canvas-area')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    root.querySelector<HTMLButtonElement>('[data-builder-clear]')?.addEventListener('click', () => {
      selections.forEach((selected) => selected.clear());
      selectedPreset = 'custom';
      selectedConnection = undefined;
      renderPlacement();
      renderStage();
      announce(
        translate(
          'Architecture réinitialisée. Sélectionnez une étape pour ajouter vos technologies.',
          'Architecture cleared. Choose a stage and add its technologies.'
        )
      );
    });

    root.dataset.initialized = 'true';
    root.dataset.enhanced = 'true';
    root.querySelectorAll<HTMLElement>('[data-builder-controls]').forEach((controls) => {
      controls.hidden = false;
    });
    applyPreset('composable', false);
    const geometryObserver = new ResizeObserver(scheduleConnectionGeometry);
    if (board) geometryObserver.observe(board);
    dropAreas.forEach((area) => geometryObserver.observe(area));
    scheduleConnectionGeometry();
    document.addEventListener(
      'astro:before-swap',
      () => {
        geometryObserver.disconnect();
        if (geometryFrame !== undefined) window.cancelAnimationFrame(geometryFrame);
      },
      { once: true }
    );
  });
}
