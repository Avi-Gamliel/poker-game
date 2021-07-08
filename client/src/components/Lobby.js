import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { MDBContainer } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import { useAuth } from '../contexts/AuthContext'
import { ImExit } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { SET_ERROR } from '../redux/actionsRedux/errorActions'
import io from "socket.io-client";
import RoomSetting from './subComponents/RoomSetting'
import { JOIN_ROOM } from '../redux/actionsRedux/roomAction'
import { toggleFullScreen } from '../globalFunctions'
import { RiFullscreenLine } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { db } from '../firebase'
import { PopUpModal } from './subComponents/PopUpModal'
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";
import { TOGGLE_SOUND } from '../redux/actionsRedux/soundActions'

const Home = (props) => {

    const dispatch = useDispatch()
    const ERRORS = useSelector(state => state.ERRORS)
    const SOUNDS = useSelector(state => state.SOUNDS)
    const [roomsClub, setRoomClubs] = useState([])
    const socketRef = useRef();
    const cashRef = useRef();
    const [cash, setCash] = useState()
    const [room, setRoomId] = useState()
    const roomID = useRef();
    const CreateRoomID = useRef();
    const smallRef = useRef();
    const bigRef = useRef();
    const { dataUser, logout, currentUser } = useAuth()
    const [dataRoom, toggleDataRoom] = useState(false);
    const [costum, setCustom] = useState(false);
    const [smallBig, setSmallBig] = useState({
        small: 5,
        big: 10
    });
    const [inputSmall, setInputSmall] = useState();
    const [inputBig, setInputBig] = useState();
    const [toggleModal, setToggleModal] = useState({
        type: false,
        name: ''
    })

    useEffect(() => {
        socketRef.current = io.connect("/lobby");
        socketRef.current.on('answer-create-room', data => {
            if (data) {
                dispatch(SET_ERROR({ type: null, msg: 'room exist' }))
            } else {
                toggleDataRoom(true);
            }
        })
    }, []);

    useEffect(() => {
        const time = setTimeout(() => {
            dispatch(SET_ERROR({ type: null, msg: '' }))
        }, 4000);
        return () => {
            clearTimeout(time)
        }
    }, [ERRORS.msg])

    useEffect(() => {

        const isMounted = db.collection('users').doc(currentUser.uid).collection('rooms').get().then(snapshot => {

            let count = snapshot.docs.length;
            if (roomsClub.length < count) {
                const newArr = [];
                snapshot.forEach((doc) => {
                    newArr.push({ data: doc.data(), id: doc.id })
                })
                setRoomClubs(newArr)
            }

        })
        return isMounted;
    }, [])

    const exitApp = async () => {
        await logout()
        props.history.push('/login')
    }

    const openSetting = () => {
        props.history.push('/update-profile')
    }

    const create = async (e) => {

        const cashTemp = cashRef.current.value;
        const room_ID = CreateRoomID.current.value;

        setCash(prev => Number(cashTemp))
        setRoomId(prev => Number(room_ID))

        if (cash === '') {
            return dispatch(SET_ERROR({ type: null, msg: 'you need to make name and cash' }))
        }

        socketRef.current.emit('check-create-room', Number(room_ID))

    }

    const Join = async () => {
        const room_ID = roomID.current.value;
        const name = await dataUser && dataUser.name;
        const cashTemp = cashRef.current.value;

        setCash(prev => Number(cashTemp))
        setRoomId(prev => Number(room_ID))

        if (name === '' || cash === '') {
            return dispatch(SET_ERROR({ type: null, msg: 'you need to make name and cash' }))
        }
        socketRef.current.emit('check-join-room', Number(room_ID))
        socketRef.current.on('answer-join-room', data => {
            if (data) {
                dispatch(JOIN_ROOM({ name, cash: Number(cashTemp), roomId: Number(room_ID), admin: false }))
                props.history.push({
                    pathname: `/room/${Number(room_ID)}`,
                    state: `${Number(cashTemp)}-${name}`,
                });
            } else {
                dispatch(SET_ERROR({ type: null, msg: 'room not exist' }))
            }
        })
    }

    const addBigSmall = (small, big) => {
        if (!inputBig || !inputSmall) {
            setSmallBig({ small, big })
        }
    }

    const addBigSmallContext = async (e) => {


        const name = await dataUser && dataUser.name;
        if (smallBig.small) {
            dispatch(JOIN_ROOM({ name, cash, roomId: room, admin: true, big_small: smallBig }))
        } else {
            const big = bigRef.current.value;
            const small = smallRef.current.value;
            dispatch(JOIN_ROOM({ name, cash, roomId: room, admin: true, big_small: { small, big } }))
        }

        props.history.push({
            pathname: `/room/${room}`,
            state: `${cash}-${name}`,
            hash: 'admin'
        });

    }

    return (
        <>
            {(toggleModal.type && toggleModal.name !== '') && <PopUpModal setToggleModal={setToggleModal} toggleModal={toggleModal.name} roomsClub={roomsClub} setRoomClubs={setRoomClubs} />}

            <div className='btnSound'>{SOUNDS.active ? <BsVolumeUpFill color='white' className='sound' size={17} onClick={() => dispatch(TOGGLE_SOUND())} /> : <BsVolumeMuteFill color='white' className='sound' size={23} onClick={() => dispatch(TOGGLE_SOUND())} />}</div>
            <div className='btnRooms'> <SiGoogleclassroom color='white' className='roomsBtn' size={17} onClick={() => setToggleModal({
                type: true,
                name: 'rooms'
            })} /> </div>

            <div className="barsetting">
                <ImExit className="exitIcon" onClick={exitApp} size={17} />
                <IoIosSettings className="exitIcon" onClick={openSetting} size={17} />
                <h4 className="name-user text-white">
                    {dataUser && dataUser.name}
                </h4>
            </div>

            <div className='btnFullScreenLobby'><RiFullscreenLine color='white' size={17} onClick={() => toggleFullScreen()} /></div>

            <MDBContainer className="main">

                <h4 className="text-center w-100 text-white img-user-box">
                    <div className='box-img'>


                        <img className='img-player' src={dataUser && dataUser.photo} alt='' />
                    </div>
                </h4>

                <div className="bx-shadow box">

                    {dataRoom
                        ?
                        <RoomSetting
                            smallBig={smallBig}
                            setCustom={setCustom}
                            addBigSmall={addBigSmall}
                            costum={costum}
                            setSmallBig={setSmallBig}
                            setInputBig={setInputBig}
                            setInputSmall={setInputSmall}
                            bigRef={bigRef}
                            smallRef={smallRef}
                            inputBig={inputBig}
                            inputSmall={inputSmall}
                            addBigSmallContext={addBigSmallContext}
                            toggleDataRoom={toggleDataRoom}
                        />

                        :
                        <div className='inside-box'>
                            <span className='t-w c-g'>CASH</span>
                            <input className="input" placeholder='Add Cash' label="Add cash" type="number" ref={cashRef} />
                            <span className='t-w c-g'>MAKE ROOM</span>
                            <input className="input" placeholder='Type name room' label="Create room name" ref={CreateRoomID} />
                            <button color="success" className=" btn-create mb-2" onClick={create}>Create room</button>
                            <span className='t-w c-g'>JOIN ROOM</span>
                            <input className="join input" placeholder='Type name room' label="Join room" ref={roomID} />
                            <button color="secondary" className="mb-2 btn-join" onClick={Join}>Join room</button>
                        </div>
                    }

                </div>
            </MDBContainer>
        </>
    );
};

export default Home;