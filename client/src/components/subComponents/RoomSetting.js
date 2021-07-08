import React from 'react'
import { MDBInput } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import { FiArrowRight } from "react-icons/fi";

const BoxSmallBig = (props) => {
    const small = props.data.small;
    return (
        <div className={props.styleDetail}
            style={props.smallBig.small === small ? styles.choose : null}
            onClick={() => {
                props.setCustom(false)
                props.setInputSmall()
                props.setInputBig()
                props.addBigSmall(small, props.data.big)
            }}>{small} / {props.data.big} </div>
    )
}

function RoomSetting(props) {

    const bigSmallArray = [[5, 10], [10, 20], [50, 100], [500, 1000]]

    return (
        <div className="form-main-room">
            <div className="form-data-room">
                <div className="line">
                    <h6 className="title-line">Add Room Rules</h6>
                    <FiArrowRight color="white" className="arrow-right-login" onClick={() => props.toggleDataRoom(false)} />
                </div>

                <div className="w-100 p-2 d-flex justigy-content-center flex-row flex-wrap">
                    {bigSmallArray.map((item, i) => (
                        <BoxSmallBig
                            key={i}
                            setCustom={props.setCustom}
                            addBigSmall={props.addBigSmall}
                            setInputSmall={props.setInputSmall}
                            setInputBig={props.setInputBig}
                            styleDetail='choose-big-small'
                            data={{ small: item[0], big: item[1] }}
                            smallBig={props.smallBig}
                        />
                    ))}

                    <div className="choose-big-small costum"
                        style={props.costum ? styles.choose : null}
                        onClick={() => {
                            if (!props.costum) {
                                props.setSmallBig({ small: null, big: null })
                            }
                            props.setCustom(prev => !prev)
                        }}>CUSTOM</div>
                </div>

                {props.costum ?
                    <div className="box-cutom-bigSmall">
                        <MDBInput size="6" label="Big" className=" m-0 big-choose " type="number" onInput={(e) => {
                            props.setInputBig()
                            props.setInputSmall(e.target.value)
                        }} inputRef={ref => props.bigRef.current = ref} value={props.inputBig && Number(props.inputBig) * 2} />
                        <MDBInput size="6" label="Small" className="m-0  small-choose " type="number" onInput={(e) => {
                            props.setInputSmall();
                            props.setInputBig(e.target.value)
                        }} inputRef={ref => props.smallRef.current = ref} value={props.inputSmall && Number(props.inputSmall) / 2}>
                        </MDBInput>
                    </div>
                    : null}

                <button color="secondary" className="mb-2 m-4 btn-rules w-100" type="click" onClick={(e) => props.addBigSmallContext(e)}>
                    start
                </button>
            </div>
        </div>
    )
}

const styles = {
    choose: {
        color: 'black', backgroundColor: 'rgb(255, 255, 255)', fontWeight: 900
    }
}


export default RoomSetting
