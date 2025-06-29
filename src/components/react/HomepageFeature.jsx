import FeatherIcon from "feather-icons-react";
import { markdownify } from "@/lib/utils/textConverter";

const HomapageFeature = ({ feature_list }) => {
  return (
    <div className="key-feature-grid mt-10 grid grid-cols-2 gap-7 md:grid-cols-3 xl:grid-cols-4 ">
      {feature_list.map((item, i) => {
        return (
          <div
            key={i}
            className="flex flex-col justify-between rounded-lg bg-surface p-4 shadow-lg hover:shadow-xl hover:shadow-secondary/50 transition-all hover:scale-105"
          >
            <div>
              <div className="flex flex-row items-center">
                <span className="icon">
                  <FeatherIcon icon={item.icon} />
                </span>
                <h3 className="ml-2 break-all text-sm md:text-lg">
                  {item.title}
                </h3>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: markdownify(item.content) }}
              ></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomapageFeature;
