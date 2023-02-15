import { heightOfPdf } from "./contants"

export const calculateCoordicate = (xAxis, yAxis) => {
    var page = parseInt(yAxis / heightOfPdf + 1);
    var y = yAxis;
    if (page > 1) {
        y = y - heightOfPdf * (page - 1);
    }
    var obj = {
        page: page,
        x: xAxis,
        y: y
    }
    return obj;
}