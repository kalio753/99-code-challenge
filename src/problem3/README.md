# Code Challenge

### Problem 3

**Type library is not imported**

```ts
interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    ...
}
```

\_I guess the BoxProps here is from MUI or some other libraries. Therefore, we should add something like this on top of the file:

```ts
import { BoxProps } from "@mui/material/Box"
```

\_Moreover, the props is currently not added any other types, therefore, we should remove the extends interface and put it directly into the props type

```ts
const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
    ...
}
```

#

**Custom hooks are not imported (Line 16, 17)**

```ts
...
const balances = useWalletBalances()
const prices = usePrices()
...
```

\_Should add import at the top

```ts
import { useWalletBalances, usePrices } from "/path-to-customHooksFile"
```

#

**Switch case duplicated return (Line 27)**

```ts
...
case "Zilliqa":
    return 20
case "Neo":
    return 20
...
```

\_Replace with this:

```ts
...
case "Zilliqa":
case "Neo":
    return 20
...
```

#

**Wrong variable name (Line 36)**

\_There are three things in this section: <br>

<li>The "lhsPriority" variable is not declared anywhere in the code</li>
<li>The logic of the "balance.amount" should be positive I guess</li>
<li>There are no key named "blockchain" in type "WalletBalance"</li>

```ts
...
return balances
    .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain)
        if (lhsPriority > -99) {
            if (balance.amount <= 0) {
                return true
            }
        }
        return false
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        if (leftPriority > rightPriority) {
            return -1
        } else if (rightPriority > leftPriority) {
            return 1
        }
    })
...
```

\_Replace with this:

```ts
...
return balances
    .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.currency)
        if (balancePriority > -99) {
            if (balance.amount > 0) {
                return true
            }
        }
        return false
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.currency)
        const rightPriority = getPriority(rhs.currency)
        if (leftPriority > rightPriority) {
            return -1
        } else if (rightPriority > leftPriority) {
            return 1
        }
    })
...
```

#

**Decrease perfomance because to much render and wrong variable (Line 57)**

\_There are several problems with this section:

<li>We should place the "formattedBallances" declartion inside a UseMemo in order not to let it re-declare on every single re-render</li>
<li>The next thing is that the rows declaration is using "sortedBalances" to map but the parameter have type of "FormattedWalletBalance" and using "balance.formatted" to parse to another component</li>
<li>The "classes" object is not defined in the source</li>

```ts
...
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
        ...balance,
        formatted: balance.amount.toFixed(),
    }
})

const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            )
        }
    )
...
```

\_Replace with this:

```ts
...
const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed(),
        }
    })
}, [sortedBalances])

const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount
            return (
                <WalletRow
                    className={}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            )
        }
    )
...
```
