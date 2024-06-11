import * as TokenImg from "../image/tokens"
import Select from "react-select"

export default function CurrencyBlock({
    inputValue,
    setInputValue,
    currency,
    onCurrencyChange,
    options,
    isResult,
}) {
    return (
        <div
            className="block-container"
            style={
                isResult
                    ? {
                          borderTopRightRadius: 8,
                      }
                    : {
                          borderTopLeftRadius: 8,
                      }
            }
        >
            <div className="block-container-top">
                <img
                    className="block-container-top--logo"
                    src={TokenImg[currency.label]}
                    alt=""
                />
                <div className="block-container-top--label">
                    {currency.label}
                </div>
                <Select
                    value={currency}
                    onChange={onCurrencyChange}
                    options={options}
                    className="block-container-top--select"
                />
            </div>

            <div className="block-container-center">
                {!isResult ? (
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        type="number"
                        className="block-container-center--input"
                    ></input>
                ) : (
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        type="number"
                        className="block-container-center--input-disabled"
                        disabled
                    ></input>
                )}
            </div>

            <div className="block-container-bottom">
                <div className="block-container-bottom--supscription">
                    1 {currency.label} = $
                    {parseFloat(currency.price).toFixed(3)} USD
                </div>
            </div>
        </div>
    )
}
