import { useState } from 'react'
import { useSelector } from 'react-redux';
import { GoX } from "react-icons/go";
import { GiCheckMark } from "react-icons/gi";
import { SiCashapp } from "react-icons/si";
import { RiTimerFlashLine } from "react-icons/ri";

const Card = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    return (
        <>
            {
                props.card.value > 0 ?
                    <div className={`card-design ${props.name === 'board' ? 'card-board-design' : props.name !== ROOM.player.name ? 'guset-card-design' : ''}`}>
                        <div className={`card-ui ${props.name === ROOM.player.name ? '' : props.name === 'board' ? 'board-card-ui' : 'guset-card-ui'}`} data={`${props.card.value === 14 ? 'A' : props.card.value === 13 ? 'K' : props.card.value === 12 ? 'Q' : props.card.value === 11 ? 'J' : props.card.value} ${props.card.suit === 'H' ? '♥' : props.card.suit === 'D' ? '♦' : props.card.suit === 'C' ? '♠' : props.card.suit === 'S' ? '♣' : null}`} style={{
                            color: props.card.suit === 'H' || props.card.suit === 'D' ? 'red' : props.card.suit === 'S' || props.card.suit === 'C' ? 'black' : '',
                        }}>
                            {props.card.suit === 'H' ? '♥' : props.card.suit === 'D' ? '♦' : props.card.suit === 'C' ? '♠' : props.card.suit === 'S' ? '♣' : null}
                        </div>
                    </div>
                    :
                    <div className="card-design-hide">
                        <img className='player-cards-hide' alt='' />
                    </div>
            }
        </>
    )
}

export const TableImgComp = () => {
    return (
        <div className="table-img">
            <div className="inside-board">
                <div className="part-1"></div>
                <div className="part-3"></div>
            </div>
            <div className="board-img">
                <div className="part-1"></div>
                <div className="part-3"></div>
            </div>
        </div>
    )
}

export const PlayerMain = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    const roomChair = ROOM.player.chair;

    let rest;
    if (ROOM.player.chair) {
        rest = 6 - roomChair;
    } else {
        rest = 0
    }

    return (
        <div className={`player chair-${props.num} player-${props.num - rest > 9 ? props.num - rest - 9 : props.num - rest <= 0 ? props.num - rest + 9 : 0 < props.num - rest < 9 ? props.num - rest : props.num} `} >
            <PlayerBox num={props.num}
                sitPlayer={props.sitPlayer}
                playerDetails={props.playerDetails}
                dealer={props.dealerRef}
                acceptBuy={props.acceptBuy}
                acceptTime={props.acceptTime}
                rejectBuy={props.rejectBuy}
            />
        </div>
    )
}

export const PlayerBox = (props) => {

    const [press, setPress] = useState();
    const [toggleBuy, setToggleBuy] = useState(false);
    const ROOM = useSelector(state => state.ROOM)
    const [toggleTime, setToggleTime] = useState(false);

    return (
        <>
            {props.playerDetails.toBuy > 0 &&
                <div className="boxBuyPlayer">


                    <SiCashapp color='white' size={20} style={{ borderRadius: '50%' }} onClick={() => ROOM.admin && setToggleBuy(prev => !prev)} ></SiCashapp>
                    {toggleBuy &&
                        <>
                            <span className="toBuY" onClick={() => props.acceptBuy(props.playerDetails)}> {props.playerDetails.toBuy}
                                <GiCheckMark color="#ff4e2f" style={{ width: 15, height: 15, background: 'white', borderRadius: '50%', padding: 2, marginLeft: 4 }} />
                            </span>
                            <span className="toBuY" onClick={() => props.rejectBuy(props.playerDetails)}>
                                <GoX color="#ff4e2f" style={{ width: 15, height: 15, background: 'white', borderRadius: '50%', padding: 2, marginLeft: 4, marginRight: 4 }} />
                            </span>
                        </>
                    }
                </div>
            }

            {props.playerDetails.time &&
                <span className="boxBuyPlayer" >
                    <RiTimerFlashLine
                        color='white'
                        size={20}
                        style={{ borderRadius: '50%' }} onClick={() => ROOM.admin && setToggleTime(prev => !prev)} />
                    {toggleTime &&
                        <>
                            <span className="toBuY">
                                <GiCheckMark color="#ff4e2f" style={{ width: 15, height: 15, background: 'white', borderRadius: '50%', padding: 2, marginLeft: 4 }}
                                    onClick={() => props.acceptTime(props.playerDetails)} />
                            </span>
                            <span className="toBuY">
                                <GoX color="#ff4e2f" style={{ width: 15, height: 15, background: 'white', borderRadius: '50%', padding: 2, marginLeft: 4, marginRight: 4 }} />
                            </span>
                        </>
                    }
                </span>
            }

            <div className={`player-details ${!props.playerDetails.active ? 'no-active' : ''}`} >
                <div
                    className={`player-img ${props.num} ${props.playerDetails.winner ? 'winner' : ''}`}
                    onClick={(e) => props.num === 6 ? setPress(prev => !prev) : props.sitPlayer(e)}
                    style={{ width: props.playerDetails.talk && 200 }}
                >
                    <div className={`img-circle `} >
                        {props.playerDetails.allIn &&
                            <span className='allInBar'>ALL IN</span>
                        }
                        <img src={props.playerDetails.img} className={`img-user ${props.playerDetails.talk ? 'active-player' : ''}  ${props.playerDetails.winner ? 'winner' : ''}`} alt='' />
                    </div>
                </div>

                {props.num !== 6 &&
                    props.playerDetails.name !== '' &&
                    <>
                        <div className="player-name">{props.playerDetails.name.split(" ")[0]}</div>
                        <div className="player-cash">{props.playerDetails.cash !== 0 && props.playerDetails.cash}</div>
                    </>
                }
            </div>

            <div className={`player-cards  ${press ? 'openCard' : ''}`}>
                <div className={`card-box`}>
                    <div className={`card-1`}>
                        {props.playerDetails.cards.length > 0
                            &&
                            <Card card={props.playerDetails.cards[0]} name={props.playerDetails.name} />
                        }
                    </div>

                    <div className={`card-2`} >
                        {props.playerDetails.cards.length > 0
                            &&
                            <Card card={props.playerDetails.cards[1]} name={props.playerDetails.name} />
                        }
                    </div>
                </div>
            </div>

            {
                props.playerDetails.dealer &&
                <div className="dealer-button">
                    <div className="bottom-dealer">D</div>
                </div>
            }

            {(() => {
                if (props.playerDetails.bet > 0 || props.playerDetails.action === 'check' || props.playerDetails.action === 'big' || props.playerDetails.action === 'small' || props.playerDetails.action === 'S' || props.playerDetails.allIn) {
                    return <div className="player-postions" style={{ background: props.playerDetails.allIn && 'rgba(255, 78, 47, 0.6)' }}>
                        <div className={!props.playerDetails.allIn ? `chipsImage` : ''} style={{ color: 'white', backgroundColor: props.playerDetails.action === 'allin' ? 'rgba(255, 78, 47, 0.6)' : props.playerDetails.action === 'call' ? 'green' : props.playerDetails.action === 'big' ? 'grey' : props.playerDetails.action === 'B' || props.playerDetails.action === 'S' ? 'grey' : props.playerDetails.action === 'check' ? '#4389f0' : props.playerDetails.action === 'check' ? 'blue' : props.playerDetails.action === 'raise' ? 'orange' : '' }}>
                            {props.playerDetails.allIn ?
                                <span className='chip-user'></span>
                                : <span className='text-action'>
                                    {props.playerDetails.action === 'big' ? 'B' : props.playerDetails.action === 'allin' ? 'A' : props.playerDetails.action === 'S' ? 'S' : props.playerDetails.action === 'call' ? 'c' : props.playerDetails.action === "check" ? 'c' : props.playerDetails.action === 'raise' ? 'r' : ''}
                                </span>
                            }
                        </div>
                        <div className="containerPos">
                            {props.playerDetails.allIn ? props.playerDetails.sidepot : props.playerDetails.bet > 0 && props.playerDetails.bet}
                        </div>
                    </div>
                }
            })()}
        </>
    )
}

export const DealerComp = (props) => {
    return (
        <div className="dealer-cards" ref={ref => props.reference.current = ref} >
            <div className="dealer-Box">
                <div className="deck-card"></div>
            </div>
        </div>
    )
}

export const Board = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    return (
        <>
            <div className="card-board flop-1">
                {ROOM.game.board.length > 0 && <Card card={ROOM.game.board[0]} name='board' />}
            </div>
            <div className="card-board flop-2">
                {ROOM.game.board.length > 0 && <Card card={ROOM.game.board[1]} name='board' />}
            </div>
            <div className="card-board flop-3">
                {ROOM.game.board.length > 0 && <Card card={ROOM.game.board[2]} name='board' />}
            </div>
            <div className="card-board turn flop-4">
                {ROOM.game.board.length > 3 && <Card card={ROOM.game.board[3]} name='board' />}
            </div>
            <div className="card-board river flop-5">
                {ROOM.game.board.length > 4 && <Card card={ROOM.game.board[4]} name='board' />}
            </div>
        </>
    )
}