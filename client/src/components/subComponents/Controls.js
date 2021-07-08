import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
import { FaRegHandRock } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiTimerFlashLine } from "react-icons/ri";


export const Left = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <div className="controls-buttons">
            <button type="button" className={`btn-play ${ROOM.player.toCall > 0 ? 'call' : 'check'}`} id="btnDesign checkCallBtn"
                onClick={() => {
                    if (ROOM.player.talk) {
                        props.playerAction(ROOM.player.toCall > 0 ? 'call' : 'check', ROOM.player.toCall)
                    }
                }}
                style={{ minWidth: 35 }}
            >
                {ROOM.player.toCall > 0 && <span className="toCallNum">{ROOM.player.toCall > 0 && ROOM.player.toCall}</span>}
                <span className="btName">{dimensions.width < 400 ?
                    ROOM.player.toCall > 0
                        ?
                        <GiCheckMark size={15} style={{ marginTop: '-5px' }} />
                        :
                        <FaRegHandRock size={20} />
                    : ROOM.player.toCall > 0 ? 'CALL' : 'CHECK'}</span>
            </button>
            <button type="button" className={`btn-play raise ${props.toRaise === 0 ? 'off' : ''}`}
                onClick={() => {
                    if (ROOM.player.talk) {
                        if (props.toRaise > 0) {
                            props.playerAction('raise', props.toRaise)

                        }
                    }
                }}
            >
                <span className="btName"> {dimensions.width < 400 ? '' : 'RAISE'}
                    {dimensions.width < 400 && <IoMdArrowRoundUp color='white' size={20} />}

                </span>
            </button>
            <button type="button" className="btn-play fold"
                onClick={() => {
                    if (ROOM.player.talk) {
                        props.playerAction('fold')
                    }
                }}
            >
                {dimensions.width < 400 ?
                    <IoMdArrowRoundDown color='white' size={20} />
                    : 'FOLD'
                }
            </button>
        </div>
    )

}

export const Middle = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    return (
        <div className="middleBtn">
            <div className="main-player-cash">
                <span className="cash-main">
                    {ROOM.player.cash > 0 ? ROOM.player.cash : <button className='buy-more-btn' onClick={() => props.openCashBuy()}>BUY MORE</button>}
                </span>
            </div>
        </div>
    )
}

export const Right = (props) => {

    const [toggle, setToggle] = useState(false)
    const ROOM = useSelector(state => state.ROOM)
    useEffect(() => {
        if (ROOM.lastMove) {
            props.setRangeInput(ROOM.lastMove.raise)
            props.setToraise(ROOM.player.toCall * 2)
        }

    }, [ROOM.lastMove])
    useEffect(() => {
        function toggleRaise(e) {
            if (e.target.className !== 'slider-raise') {
                if (e.target.className.baseVal !== 'toggle-raise') {
                    setToggle(false)
                }
            }
        }

        document.addEventListener('click', (e) => {
            if (toggle) {
                toggleRaise(e)
            }
        })

        return () => {
            document.removeEventListener('click', toggleRaise)
        }

    }, [toggle])


    return (
        <>
            <div className="rightControl">
                <RiTimerFlashLine
                    className={`timer-icon ${ROOM.player.talk ? 'off' : ''}`}
                    color='white' size={25}
                    onClick={() => {
                        if (!ROOM.player.talk) {
                            props.askTime('asdasd')
                        }
                    }}
                />
                {<span className="toRaiseBox">{
                    props.toRaise > ROOM.player.toCall + ROOM.player.toCall
                        ?
                        props.toRaise
                        :
                        ROOM.player.toCall + ROOM.player.toCall}
                </span>}
                {toggle ?
                    <AiOutlineDown className="toggle-raise" onClick={() => setToggle(prev => !prev)} />
                    : <AiOutlineUp className="toggle-raise" onClick={() => setToggle(prev => !prev)} />
                }
            </div>
            {toggle ?
                <div className="controls-slider">
                    <input
                        type="range"
                        className="slider-raise"
                        min={ROOM.player.toCall + ROOM.player.toCall}
                        step="5"
                        value={props.rangeInput}
                        max={ROOM.player.cash}
                        ref={ref => props.range.current = ref}
                        onChange={props.changeRange}
                    ></input>
                </div>
                : null}
        </>
    )
}