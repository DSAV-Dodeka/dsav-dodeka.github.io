import React from "react";
import "./Title.scss";

function Title(props) {
    return(
        <div class="title_class_1">
            <h1 class={"title_class_2" + (props.position === "left" ? " text-left" : " text-right")}>
                {props.title}
            </h1>
        </div>
    )
}

export default Title;