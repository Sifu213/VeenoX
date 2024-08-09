import { FuturesAssetProps } from "@/models";
import { getFormattedAmount, getFormattedDate } from "@/utils/misc";

type TradeSectionProps = {
  asset: FuturesAssetProps;
};

export const TradeSection = ({
  asset,
  trades,
  isLoading,
}: TradeSectionProps) => {
  return (
    <div className="max-h-[668.5px] overflow-y-scroll relative">
      <table className="w-full">
        <thead>
          <tr className="text-font-60 text-xs font-normal sticky top-0 bg-secondary border-b border-borderColor-DARK ">
            <th className="pl-2.5 text-start pt-2 pb-1 font-normal">Price</th>
            <th className="text-end font-normal">Size</th>
            <th className="pr-2.5 text-end font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? "Loading..."
            : trades?.map((trade, i: number) => (
                <tr key={i} className="text-font-80 text-xs">
                  <td
                    className={`pl-2.5 ${i === 0 ? "py-2" : "py-[5.2px]"} ${
                      trade.side === "BUY" ? "text-green" : "text-red"
                    }`}
                  >
                    {getFormattedAmount(trade.price)}
                  </td>
                  <td
                    className={`py-1 text-end ${
                      trade.side === "BUY" ? "text-green" : "text-red"
                    }`}
                  >
                    {trade.size}
                  </td>
                  <td className="text-end pr-2.5 py-1">
                    {getFormattedDate(trade.ts)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
