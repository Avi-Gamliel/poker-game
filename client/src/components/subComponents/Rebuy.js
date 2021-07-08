import React, { useState } from 'react'
import { FiArrowRight } from "react-icons/fi";

function Rebuy(props) {
    const [valuCash, setValueCash] = useState(0)
    return (
        <div className="containerBuy">
            <input className="inputButMore" placeholder='0.00' value={valuCash} onChange={(e) => { setValueCash(e.target.value) }} type="number" />
            <div className="btnGroup">
                <div className="btnBuyMore" onClick={() => {
                    props.buyCash(Number(valuCash))
                    props.setToggleModal(prev => !prev)
                }}> Buy</div>
                <div className="btnBack" onClick={() => props.setBuyCash(false)}>
                    <FiArrowRight />
                </div>

            </div>
        </div>
    )
}

export default Rebuy
