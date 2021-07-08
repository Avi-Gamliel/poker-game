import React, { useState } from 'react'
import { Score } from './Score'
import { Menu } from './Menu'
import { Finish } from './Finish'
import { RoomsPlayer } from './RoomsPlayer'
import FormLogin from './FormLogin'
import { FiArrowRight } from "react-icons/fi";
export const PopUpModal = (props) => {
    const [toggleRoom, setToggleRoom] = useState(false)
    return (
        <div className={`box-score`}>
            <div className="container-Score">
                <div className="box-score-rooms">
                    <h1 className='title-score'>
                        {props.toggleModal}
                    </h1>
                    {toggleRoom && <div className="btnBackRooms" onClick={() => setToggleRoom(false)}>
                        <FiArrowRight />
                    </div>
                    }
                </div>
                {props.toggleModal === 'Score' ? <Score onfuncion={props.onfuncion} /> :
                    props.toggleModal === 'Menu' ? <Menu onfuncion={props.onfuncion} setToggleModal={props.setToggleModal} buyCash={props.buyCash} rejectBuy={props.rejectBuy} rebuy={props.rebuy} /> :
                        props.toggleModal === 'finish' ? <Finish setToggleModal={props.setToggleModal} finishGameAccept={props.finishGameAccept} /> :
                            props.toggleModal === 'rooms' ? <RoomsPlayer roomsClub={props.roomsClub} toggleRoom={toggleRoom} setToggleRoom={setToggleRoom} setRoomClubs={props.setRoomClubs} /> :
                                props.toggleModal === 'Login' && <FormLogin error={props.error} loading={props.loading} passwordRef={props.passwordRef} emailRef={props.emailRef} handleSubmit={props.handleSubmit} />

                }
            </div>

            <div className={`box-score`} onClick={() => {
                props.setToggleModal(prev => {
                    const newClick = {
                        type: false,
                        name: 'Menu'
                    }
                    return newClick
                })
            }} ></div>
        </div>
    )
}