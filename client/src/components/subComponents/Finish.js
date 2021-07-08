import React from 'react'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
export const Finish = (props) => {


    return (
        <div className='box-finish'>
            <span className='text-finish'> Are you sure? </span>
            <div className='box-button'>
                <AiOutlineCheck color='white' size={35} className='check-finish'
                    onClick={() => props.finishGameAccept()} />
                <AiOutlineClose color='white' size={35} className='cancel-finish' onClick={() => props.setToggleModal(prev => {
                    const newClick = {
                        type: false,
                        name: ''
                    }
                    return newClick
                })} />

            </div>

        </div>
    )
}
