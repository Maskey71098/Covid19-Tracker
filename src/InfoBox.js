import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "./InfoBox.css";

function InfoBox({active, title, isRed, cases, total, ...props}) {
    return (
        <Card
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}
      >
            <CardContent>
            {/* title */}

                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>

            {/* number of cases */}
            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
            {cases}
            </h2>

            {/* Total */} 
                <Typography className="infoBox_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card> 
    )
}

export default InfoBox
