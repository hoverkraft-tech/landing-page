import React, { type PropsWithChildren } from "react";

export type ChangelogProps = PropsWithChildren & {
    date: string;
};

const Changelog = ({ children, date }: ChangelogProps) => {
    return (
        <section className="section changelogs py-0 first:pt-5">
            <div className="container">
                <div className="row justify-center">
                    <div className="lg:col-10">
                        <div className="row lg:mt-0">
                            <div className="lg:col-3">
                                <h6 className="mb-4 pl-7 text-lg lg:mt-0 lg:pl-0">{date}</h6>
                            </div>
                            <div className="lg:col-9 lg:border-l border-text/10 lg:pb-10 lg:pl-10">
                                <div className="changelogs-content p-6 lg:p-10">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Changelog;
