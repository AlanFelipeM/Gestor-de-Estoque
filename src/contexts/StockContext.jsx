import { createContext, useState } from "react";
import PropTypes from "prop-types"


export const StockContext = createContext ({})

StockContextProvider.propTypes = {
    children: PropTypes.node
}

export function StockContextProvider({children}) {
    const[items, setItems] = useState(() => {
        const storedItems = localStorage.getItem('af-react-stock')
        if (!storedItems) return []
        const items = JSON.parse(storedItems)
        items.forEach((item) => {
            item.createAT = new Date(item.createAT)
            item.updatedAT = new Date(item.updatedAT)
        })
        return items
    })

    const addItem = (item) => {
        setItems(currentState => {
            const updatedItems = [item, ...currentState]
            localStorage.setItem('af-react-stock', JSON.stringify(updatedItems))
            return updatedItems
        })
    }

    const getItem = (itemId) => {
        return items.find(item => item.id === +itemId)
    }

    const updatedItem = (itemId, newAttributes) => {
        setItems(currentState => {
            const itemIndex = currentState.findIndex(item => item.id === +itemId)
            const updatedItems = [...currentState]
            Object.assign(updatedItems[itemIndex], newAttributes, {updatedAT: new Date()})
            localStorage.setItem('af-react-stock', JSON.stringify(updatedItems))
            return updatedItems
        })
    }

    const deleteItem = (itemId) => {
        setItems(currentState => {
            const updatedItems = currentState.filter(item => item.id !== itemId)
            localStorage.setItem('af-react-stock', JSON.stringify(updatedItems))
            return updatedItems
        })
    }

    const stock = {
        items,
        addItem,
        getItem,
        updatedItem,
        deleteItem
    }


    return (
        <StockContext.Provider value={stock}>
            {children}
        </StockContext.Provider>
    )
}