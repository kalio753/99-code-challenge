import "./App.scss"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ThreeDot } from "react-loading-indicators"
import { useEffect, useRef, useState } from "react"
import CurrencyBlock from "./components/CurrencyBlock"
import { convertCrypto, getUniqueArray } from "./utlis/helper"
import ArrowIconSVG from "./image/icons/arrow.svg"
import BrandIcon from "./image/icons/99Tech.png"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// ***
// NOTE: Please check out the README.md file for more
// detail information about the application
// ***
function App() {
    const [currency1, setCurrency1] = useState()
    const [currency2, setCurrency2] = useState()
    const [options, setOptions] = useState([])
    const [convertValue, setConvertValue] = useState("")
    const [resultValue, setResultValue] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const emptyNotify = () =>
        toast.warning("Please enter a value before swapping!")

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [])

    const { isPending, error, data } = useQuery({
        queryKey: ["repoData"],
        queryFn: () =>
            axios
                .get("https://interview.switcheo.com/prices.json")
                .then((res) => {
                    const cur1 = res.data.find((c) => c.currency === "USD")
                    setCurrency1({
                        price: cur1.price,
                        label: cur1.currency,
                        value: cur1.currency,
                    })
                    const cur2 = res.data.find((c) =>
                        c.currency.includes("BTC"),
                    )
                    setCurrency2({
                        price: cur2.price,
                        label: cur2.currency,
                        value: cur2.currency,
                    })

                    setOptions(
                        getUniqueArray(
                            res.data?.map((c) => ({
                                value: c.currency,
                                label: c.currency,
                                price: c.price,
                            })),
                            "value",
                        ),
                    )
                    return res.data
                }),
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (!convertValue) {
            emptyNotify()
        } else {
            setResultValue(
                convertCrypto(convertValue, currency1.price, currency2.price),
            )
        }
    }

    const handleConvert = () => {
        setCurrency1(currency2)
        setCurrency2(currency1)
        setConvertValue(resultValue)
        setResultValue(convertValue)
    }

    if (error) return "An error has occurred: " + error.message

    return (
        <>
            <ToastContainer />
            <div className="App">
                <div className="section">
                    <img src={BrandIcon} alt="" />
                    {!isPending && !isLoading ? (
                        <form
                            className="form-container fade-in-bottom"
                            id="form1"
                            onSubmit={handleFormSubmit}
                        >
                            <div className="form-upper">
                                <CurrencyBlock
                                    inputValue={convertValue}
                                    setInputValue={setConvertValue}
                                    currency={currency1}
                                    onCurrencyChange={(e) => {
                                        setCurrency1((prev) => {
                                            setConvertValue("")
                                            setResultValue("")
                                            return e
                                        })
                                    }}
                                    options={options}
                                />
                                <div className="form-icon">
                                    <img
                                        src={ArrowIconSVG}
                                        alt="ArrowIconSVG"
                                        onClick={handleConvert}
                                        className="heartbeat"
                                    />
                                </div>
                                <CurrencyBlock
                                    inputValue={resultValue}
                                    setInputValue={setResultValue}
                                    currency={currency2}
                                    onCurrencyChange={(e) => {
                                        setCurrency2((prev) => {
                                            setConvertValue("")
                                            setResultValue("")
                                            return e
                                        })
                                    }}
                                    options={options}
                                    isResult={true}
                                />
                            </div>
                            <button
                                className="form-btn"
                                type="submit"
                                form="form1"
                                value="Submit"
                            >
                                Swap
                            </button>
                        </form>
                    ) : (
                        <ThreeDot
                            variant="pulsate"
                            color="#5e40de"
                            size="medium"
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default App
