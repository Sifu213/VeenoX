import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { cn } from "@/utils/cn";
import { formatSymbol } from "@/utils/misc";
import { useWS } from "@orderly.network/hooks";
import { useEffect, useRef, useState } from "react";
import { Timezone } from "../../../../../public/static/charting_library/charting_library";
import { DISABLED_FEATURES, ENABLED_FEATURES } from "./constant";
import { Datafeed } from "./datafeed";
import { widgetOptionsDefault } from "./helper";
import { overrides } from "./theme";

interface TradingViewChartProps {
  asset: FuturesAssetProps;
  mobile?: boolean;
  custom_css_url?: string;
  className?: string;
}

const TradingViewChart = ({
  asset,
  mobile = false,
  custom_css_url = "../themed.css",
  className = "",
}: TradingViewChartProps) => {
  const { isChartLoading, setIsChartLoading } = useGeneralContext();
  const ref = useRef<HTMLDivElement>(null);
  const [tvWidget, setTvWidget] = useState<any>(null);
  const ws = useWS();

  const chartInit = () => {
    if (!asset) return;

    import("../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        if (!ref.current) return;

        const widgetInstance = new Widget({
          datafeed: Datafeed(asset, ws, setIsChartLoading) as any,
          symbol: formatSymbol(asset?.symbol),
          container: ref.current,
          container_id: ref.current.id,
          locale: "en",
          fullscreen: false,
          enabled_features: ENABLED_FEATURES,
          disabled_features: [
            ...DISABLED_FEATURES,
            ...(mobile ? ["left_toolbar"] : []),
          ],
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          autosize: true,
          theme: "Dark",
          loading_screen: { backgroundColor: "rgba(20, 20, 20, 1)" },
          studies_overrides: {
            "volume.volume.color.0": "rgba(14, 203, 129,0.3)",
            "volume.volume.color.1": "rgba(234, 57, 67, 0.3)",
          },
          ...widgetOptionsDefault,
        });

        setTvWidget(widgetInstance);

        widgetInstance.onChartReady(() => {
          widgetInstance.applyOverrides(overrides() || {});
        });
      }
    );
  };

  useEffect(() => {
    chartInit();

    // Cleanup
    return () => {
      if (tvWidget !== null) {
        tvWidget.remove();
        setTvWidget(null);
      }
    };
  }, [asset?.symbol, custom_css_url, mobile]);

  useEffect(() => {
    if (tvWidget) {
      const resizeObserver = new ResizeObserver(() => {
        tvWidget.resize();
      });

      if (ref.current) {
        resizeObserver.observe(ref.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [tvWidget]);

  return (
    <div className="relative w-full h-[450px] md:h-calc-full-chart ">
      <div
        className={`absolute z-10  bg-secondary w-full ${
          isChartLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-200 ease-in-out h-full`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img src="/loader/loader.gif" className="w-[150px]" />
        </div>
      </div>
      <div className={cn(`w-full h-full`, className)} ref={ref} />
    </div>
  );
};

export default TradingViewChart;
