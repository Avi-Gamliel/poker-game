import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ImExit } from "react-icons/im";
import { RiFullscreenLine } from "react-icons/ri";
import { toggleFullScreen } from '../globalFunctions'
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";
import { useHistory } from 'react-router-dom'
import { Left, Middle, Right } from './subComponents/Controls'
import { TableImgComp, PlayerMain, DealerComp, Board } from './subComponents/Table'
import { SET_ERROR } from '../redux/actionsRedux/errorActions'
import { useAuth } from '../contexts/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase.js';
import {
    SIT_PLAYER,
    EXIT_ROOM,
    USER_LEFT,
    UPDATE_MOVE,
    UPDATE_PLAYERS_VISIT,
    UPDATE_WINNER_LAST,
    ADD_MONEY_FOR_PLAYER,
    REJECT_BUY_FOR_PLAYER,
    ASKS_TO_BUY,
    FINISH_ROUND_END,
    LAST_PLAYER,
    UPDATE_POT_BOARD_FINISH,
    CLEAR_DATA,
    PLAY_GAME,
    SIT_CURRENT_PLAYER,
    PLAYER_STAND,
    ACTIVE_PLAYER,
    UPDATE_PLAYER_DATA,
    ASKS_TIME,
    START_TIMER,
    STOP_TIMER

} from '../redux/actionsRedux/roomAction'


import { TOGGLE_SOUND } from '../redux/actionsRedux/soundActions'
import { Howl, Howler } from 'howler';
import checkSFX from '../sfx/ceck.mp3'
import bigSFX from '../sfx/big.mp3'
import raiseSFX from '../sfx/raise.mp3'
import sendCardSfx from '../sfx/sendCard_2.mp3'
import ticketClockSfx from '../sfx/ticketClock.mp3'
import RingSound from '../sfx/Ring Sound.mp3'


import { HiEye } from 'react-icons/hi';
import { BsTable } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import { GiPokerHand } from "react-icons/gi";
import { PopUpModal } from './subComponents/PopUpModal'

const soundPlay = (src) => {
    const sound = new Howl({
        src
    });
    sound.play();
}


function Room(props) {

    const history = useHistory()
    const dispatch = useDispatch()
    const ROOM = useSelector(state => state.ROOM)
    const SOUNDS = useSelector(state => state.SOUNDS)
    const socketRef = useRef();
    const [rangeInput, setRangeInput] = useState(0);
    const range = useRef();
    const [toRaise, setToraise] = useState(0);
    const { currentUser } = useAuth()
    const [visitor, setVisitor] = useState()
    const dealerRef = useRef();
    const [rebuy, setRebuy] = useState(false)
    const [timer, setTimer] = useState(15)
    const [fullScreen, setFullScreenState] = useState(false)
    const [toggleFinish, setToggleFinish] = useState(false)
    const [toggleModal, setToggleModal] = useState({
        type: false,
        name: ''
    })

    const [timerSound, setTimerSound] = useState(new Howl({
        src: ticketClockSfx,
        volume: 0.7,
    }))
    let Timer, time;
    useEffect(() => {
        setFullScreenState(window.document.fullscreen)
    }, [fullScreen])
    useEffect(() => {
        if (ROOM.time) {

            Timer = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            time = setTimeout(() => {
                if (ROOM.player.talk) {
                    if (ROOM.player.toCall > 0) {
                        playerAction('fold')
                    } else {
                        playerAction('check')
                    }
                }
                dispatch(STOP_TIMER())
                setTimer(15);
            }, 15000);


        } else {

            clearInterval(Timer)
            clearTimeout(time)

        }

        return () => {
            if (ROOM.time) {
                clearInterval(Timer)
                clearTimeout(time)
            } else {
                clearInterval(Timer)
                clearTimeout(time)
            }

        }

    }, [ROOM.time])

    const soundTimer = (src, type) => {

        if (type === 'play') {
            timerSound.play();

        } else {
            timerSound.stop()
        }
    }


    useEffect(() => {

        Howler.volume(1.0)

        socketRef.current = io.connect("/room");

        socketRef.current.emit('join-room', ROOM.player.name, ROOM.player.cash, ROOM.id, ROOM.bigSmall, ROOM.players.filter(x => x.active))

        socketRef.current.on('current-user-sit', (users, chair, nameSit, type) => {
            dispatch(SIT_CURRENT_PLAYER({ users, chair, name: ROOM.player.name, nameSit, type }))
        })

        socketRef.current.on('users-sits', (users, chair, nameSit, type) => {
            dispatch(SIT_PLAYER({ users, chair, name: ROOM.player.name, nameSit, type }))
        })

        socketRef.current.on('ask money', (cash, name) => {
            dispatch(ASKS_TO_BUY({ cash, name }))
        })

        socketRef.current.on("updateBigSmall", data => {
        })

        socketRef.current.on('sit Players visit', (data, board, pot) => {
            dispatch(UPDATE_PLAYERS_VISIT({ data, board, pot }))
        })

        socketRef.current.on('visitor', (num, data) => {
            setVisitor(num)
        })

        socketRef.current.on('update winner last', name => {
            dispatch(UPDATE_WINNER_LAST({ name }))
        })

        socketRef.current.on('last player', data => {
            dispatch(LAST_PLAYER({ ...data }))
            if (ROOM.admin) {
                socketRef.current.emit('start-game', ROOM.id);
            }
        })

        socketRef.current.on('leave-room', id => {
        })

        socketRef.current.on('update-players-data', (player, hand, chair) => {
            for (let i = 0; i < player.length * 2; i++) {
                setTimeout(() => {
                    soundPlay(sendCardSfx)
                }, 600 * i);
            }
            dispatch(UPDATE_PLAYER_DATA({ player, hand, chair }))
        })

        socketRef.current.on('handle finish game', (winner, round) => {
            if (winner.length > 0) {
                dispatch(FINISH_ROUND_END({ round, winner }))
            }

        })

        socketRef.current.on('player buy cash', (name, cash) => {
            dispatch(ADD_MONEY_FOR_PLAYER({ name, cash }))
        })

        socketRef.current.on('player reject cash', (name, cash) => {
            dispatch(REJECT_BUY_FOR_PLAYER({ name, cash }))
        })

        socketRef.current.on('update card and pot', (pot, board, players, stage, checkAllin) => {
            dispatch(UPDATE_POT_BOARD_FINISH({ pot, board, stage, players }))
            soundPlay(sendCardSfx)

        })

        socketRef.current.on('activeUser', (player, chair, lastmove, stage, talkname, playerData) => {
            dispatch(STOP_TIMER())
            setTimer(15);
            soundTimer(ticketClockSfx, 'stop')
            if (lastmove.move === 'check') {
                soundPlay(checkSFX)
            } else if (lastmove.move === 'call') {
                soundPlay(bigSFX)
            } else if (lastmove.move === 'raise') {
                soundPlay(raiseSFX)
            } else if (lastmove.move === 'fold') {
                soundPlay(sendCardSfx)
            }
            dispatch(ACTIVE_PLAYER({ player, chair, lastmove, stage, talkname, playerData }))
        })

        socketRef.current.on('close room', () => {
            history.goBack()
        })

        socketRef.current.on('start-timer', () => {
            dispatch(START_TIMER())
            setTimer(15);
            soundTimer(ticketClockSfx, 'play')
        })

        socketRef.current.on('clear-game', () => {
            dispatch(CLEAR_DATA())
            if (ROOM.admin) {
                socketRef.current.emit('start-game', ROOM.id);
            }
        })

        socketRef.current.on('activeOtherUser', (player, chair, lastmove, stage, talkname, playerData) => {
            if (ROOM.time) {
                dispatch(STOP_TIMER())
                setTimer(15);
                soundTimer(ticketClockSfx, 'stop')

            }
            dispatch(ACTIVE_PLAYER({ player, chair, lastmove, stage, talkname, playerData }))
        })

        socketRef.current.on('ask-time', data => {
            dispatch(ASKS_TIME({ data }))
            soundPlay(RingSound)
        })

        socketRef.current.on('update last move', (move, stage) => {
            dispatch(UPDATE_MOVE({ move, stage }))
        })

        socketRef.current.on('update stand', name => {
            const indexPlayer = ROOM.players.findIndex(p => p.name === name)
            dispatch(PLAYER_STAND(indexPlayer))
        })

        socketRef.current.on('user-left', (name) => {
            setVisitor(prev => prev - 1)
            const index = ROOM.players.findIndex(x => x.name === name);

            if (index !== -1) {
                dispatch(USER_LEFT({ index }))
            }

        })

        return history.listen(location => {
            if (history.action === 'POP') {
                socketRef.current.emit('exist-room', ROOM.player.name, ROOM.id)
                dispatch(EXIT_ROOM())
            }
        })

    }, [])


    const exitRoom = () => {
        history.goBack()
    }

    const startGame = () => {
        const filterPlayers = ROOM.players.filter(x => x.active !== false);
        if (filterPlayers.length < 2) {
            dispatch(SET_ERROR({ type: null, msg: 'waiting to players...' }))
        } else {
            dispatch(PLAY_GAME())
            socketRef.current.emit('start-game', props.match.params.roomID);
        }
    }

    function changeRange(e) {
        setRangeInput(range.current.value)
        setToraise(range.current.value)
    }

    const sitPlayer = (e) => {
        let TARGET_IMAGE = e.target.parentElement.parentElement.className;
        let TARGET = e.target.className;
        if (ROOM.player.cards.length > 0) {
            dispatch(SET_ERROR({ type: null, msg: 'you in the game' }))
        }

        if (TARGET.split(" ")[0] !== 'player-img') {
            dispatch(SET_ERROR({ type: null, msg: 'chair is bussy' }))
        } else {

            const chair = Number(TARGET.split(" ")[1]);
            const actullyChair = Number(TARGET_IMAGE.split(" ")[2].split("-")[1]);

            if (chair !== 6) {
                socketRef.current.emit("sit-player", ROOM.player.name, ROOM.player.cash, actullyChair, ROOM.id, currentUser.photoURL)
            }
        }

    }

    const playerAction = (name, cash) => {
        let finalCash;
        if (cash > ROOM.player.cash) {
            finalCash = ROOM.player.cash;
        } else {
            finalCash = cash
        }
        socketRef.current.emit('player action', { name, cash: finalCash, id: ROOM.id, playerName: ROOM.player.name })
    }

    const standUp = () => {

        const playerIndex = ROOM.players.findIndex(player => player.name === ROOM.player.name)
        if (playerIndex !== -1) {
            socketRef.current.emit('player stand', ROOM.player.name, ROOM.id)
        }

    }

    const newRound = () => {
        const cashPlayer = ROOM.players.filter(x => x.cash > 0)
        if (cashPlayer.length > 1) {
            socketRef.current.emit('clear-game', ROOM.id);
        } else {
            dispatch(SET_ERROR({ type: null, msg: 'waiting to player ...' }))
        }
    }

    const acceptBuy = (details) => {
        if (ROOM.status) {
            socketRef.current.emit('accept buy', details.name, details.toBuy, ROOM.id)
        } else {
            dispatch(SET_ERROR({ type: null, msg: 'you in the game' }))

        }
    }

    const rejectBuy = (details) => {
        socketRef.current.emit('reject buy', details.name, details.toBuy, ROOM.id)
    }

    const buyCash = (input) => {

        if (input > 0) {
            socketRef.current.emit("butMoreCash", ({
                name: ROOM.player.name,
                room_id: ROOM.id,
                cash: input,
            }))
        }

    }

    const openCashBuy = () => {
        setRebuy(true)
        setToggleModal(prev => ({
            type: true,
            name: 'Menu'
        }))
    }

    const askTime = (e) => {
        socketRef.current.emit("askTime", ({
            name: ROOM.player.name,
            room_id: ROOM.id,
            talk: ROOM.players.filter(x => x.talk)[0].name,
        }))

    }

    const acceptTime = (e) => {
        socketRef.current.emit('acceptTime', ROOM.id)
    }
    const finishGame = () => {
        setToggleModal(prev => ({
            type: true,
            name: 'finish'
        }))
    }
    const finishGameAccept = () => {
        const arrayPlayers = [];

        ROOM.players.forEach(p => {
            if (p.name !== '') {
                arrayPlayers.push(
                    {
                        name: p.name,
                        buy: p.numBuy,
                        start: p.buy,
                        cash: p.cash
                    }
                )
            }
        });

        db.collection('users').doc(currentUser.uid).collection('rooms').get().then(snapshot => {
            if (snapshot.docs.length < 6) {
                db.collection('users').doc(currentUser.uid).collection('rooms').add({
                    id: ROOM.id,
                    players: arrayPlayers
                });
            } else {
                dispatch(SET_ERROR({ type: null, msg: 'you get to max rooms, remove rooms...' }))
            }
        }).then(data => {
            setToggleModal(prev => {
                const newClick = {
                    type: true,
                    name: 'Score'
                }
                return newClick
            })

            socketRef.current.emit('close-room', ROOM.id)
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <>
            {(toggleModal.type && toggleModal.name !== '') && <PopUpModal setToggleModal={setToggleModal} toggleModal={toggleModal.name} onfuncion={standUp} buyCash={buyCash} rebuy={rebuy} finishGameAccept={finishGameAccept} />}

            <div className='containerTopRow'>

                <div className="user-data">
                    <div className="user-name">
                        <ImExit className="exitIcon" onClick={exitRoom} /> hello  <span className="name-place"> {ROOM.player.name}</span>
                    </div>
                </div>

                {ROOM.time ? <div className='time'><span className='clock'>{timer}</span></div> : null}
                <div className="right-top-bar">

                    <div className="room-details-data">
                        <div className="user-name">

                            <div className='btnSoundBtn'>{SOUNDS.active ? <BsVolumeUpFill color='white' className='sound' size={17} onClick={() => dispatch(TOGGLE_SOUND())} /> : <BsVolumeMuteFill color='white' className='sound' size={17} onClick={() => dispatch(TOGGLE_SOUND())} />}</div>
                            <div className='btnFullScreen'><RiFullscreenLine color='white' size={17} onClick={() => toggleFullScreen()} /></div>

                            <div className="visitor-box">
                                <HiEye color="black" /><span className="num-visitor">
                                    {visitor}
                                </span>
                            </div>

                            <BsTable color='black' size={16} className="score-icon text-white" onClick={() => {
                                setToggleModal(prev => {
                                    const newClick = {
                                        type: !prev.type,
                                        name: 'Score'
                                    }
                                    return newClick
                                })
                            }} />

                        </div>
                    </div>

                    <BiMenu color='white' size={22} className="menu-ico" onClick={() => {
                        setToggleModal(prev => {
                            const newClick = {
                                type: !prev.type,
                                name: 'Menu'
                            }
                            return newClick
                        })
                    }} />

                </div>

                {ROOM.admin ? ROOM.start ? <button type="button" className="startBtn" onClick={finishGame}>finish</button> : <button type="button" className="startBtn" onClick={startGame}>start</button> : null}
                {ROOM.admin ? ROOM.status && <button type="button" className="nextBtn" onClick={newRound}><GiPokerHand color='white' size={20} /></button> : null}

            </div>

            <div className="room">

                <div className="table-box">

                    <div className="top">
                        <PlayerMain num={9} sitPlayer={sitPlayer} playerDetails={ROOM.players[8]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={1} sitPlayer={sitPlayer} playerDetails={ROOM.players[0]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <DealerComp
                            reference={dealerRef}

                        />
                        <PlayerMain num={2} sitPlayer={sitPlayer} playerDetails={ROOM.players[1]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={3} sitPlayer={sitPlayer} playerDetails={ROOM.players[2]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                    </div>

                    <div className="middle">
                        <div className="table-board">
                            <div className="chip-user-pot"></div>
                            <div className="potBox">
                                <span className='chip-user'></span>
                                <div className="mainPot ">
                                    {ROOM.game.pot}
                                </div>
                            </div>
                            <div className="card-board-container">
                                <Board />
                            </div>
                        </div>
                    </div>

                    <div className="bottom">
                        <PlayerMain num={8} sitPlayer={sitPlayer} playerDetails={ROOM.players[7]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={7} sitPlayer={sitPlayer} playerDetails={ROOM.players[6]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={6} sitPlayer={sitPlayer} playerDetails={ROOM.players[5]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={5} sitPlayer={sitPlayer} playerDetails={ROOM.players[4]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                        <PlayerMain num={4} sitPlayer={sitPlayer} playerDetails={ROOM.players[3]} dealerRef={dealerRef} acceptBuy={acceptBuy} acceptTime={acceptTime} rejectBuy={rejectBuy} />
                    </div>
                    <TableImgComp />
                </div>
                <div className="controls-box">
                    <Left
                        playerAction={playerAction}
                        toRaise={toRaise}
                    />
                    <Middle openCashBuy={openCashBuy} />
                    <Right
                        rangeInput={rangeInput}
                        setRangeInput={setRangeInput}
                        setToraise={setToraise}
                        range={range}
                        toRaise={toRaise}
                        changeRange={changeRange}
                        askTime={askTime}
                    />
                </div>
            </div>
        </>
    )
}
export default Room