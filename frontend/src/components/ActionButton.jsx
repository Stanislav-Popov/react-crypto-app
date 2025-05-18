/** @format */

import { Tooltip, Typography } from "antd"

export default function ActionButton({label, onClick, title, icon: Icon}) {
    return (
        <Tooltip title={title}>
            <div
                onClick={onClick}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                }}>
                <Icon />
                <Typography.Text>{label}</Typography.Text>
            </div>
        </Tooltip>
    )
}
