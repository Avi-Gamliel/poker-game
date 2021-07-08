import React, { useState } from 'react'
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
import { BsTrash } from 'react-icons/bs'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase'

export const RoomsPlayer = (props) => {
    const { currentUser } = useAuth()
    const [room, setRoom] = useState({})
    const openRoomDetails = (p) => {
        setRoom(p)
        props.setToggleRoom(true)
    }
    const deleteRoom = (p) => {
        db.collection("users").doc(currentUser.uid).collection('rooms').doc(p).delete().then(() => {
            props.setRoomClubs(prev => {
                const newArray = prev.filter(x => x.id !== p)
                return newArray;
            })

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    return (
        <div className='box-rooms'>
            {props.toggleRoom ?
                <table className="table-main">
                    <thead>
                        <tr className="table-title">
                            <th>NAME</th>
                            <th>BUY</th>
                            <th>START</th>
                            <th></th>
                            <th>CURRENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {room.map((p, i) =>
                            <tr className={`player-score`}>
                                <td className='name-td'>{p.name}</td>
                                <td className="start-score">{p.buy}</td>
                                <td className="numBuy-score">{p.start}</td>
                                <td className="start-score">
                                    {p.start < p.cash ?
                                        <IoMdArrowRoundUp color='green' />
                                        :
                                        <IoMdArrowRoundDown color='red' />
                                    }
                                </td>
                                <td className="current-score" >{p.cash}</td>
                            </tr>
                        )}

                    </tbody>

                </table>
                :
                <table className="table-main">
                    <thead>
                        <tr className="table-title">
                            <th>ROOM</th>
                            <th>NUM PLAYERS</th>
                            <th>TOTAL CASH</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.roomsClub.map((p, i) => {
                            let cash = 0;
                            let count = 0;
                            p.data.players.forEach(c => {
                                cash += c.cash;
                                count++;
                            })
                            return <tr key={i} className={`player-score-rooms `} >
                                <td className='name-td-rooms' onClick={() => { openRoomDetails(p.data.players) }}>{p.data.id}</td>
                                <td className='name-td-rooms' onClick={() => { openRoomDetails(p.data.players) }}>{count}</td>
                                <td className='name-td-rooms' onClick={() => { openRoomDetails(p.data.players) }}>{cash}</td>
                                <td className='name-td-rooms-delete' onClick={() => { deleteRoom(p.id) }}> <BsTrash colo='white' size={15} /></td>
                            </tr>
                        })}
                    </tbody>

                </table>
            }



        </div>
    )
}
