function shortToByteArray(short) {
    const byteArray = new Uint8Array(2);
    byteArray[0] = (short >> 8) & 0xFF; 
    byteArray[1] = short & 0xFF;
    return byteArray;
}


function floatToByteArray(float) {
    const buffer = new ArrayBuffer(4); 
    const view = new DataView(buffer);
    view.setFloat32(0, float, true); 
    return new Uint8Array(buffer);
}

function byteArrayToFloat(byteArray) {
    if (byteArray.length !== 4) {
        throw new Error("Input must be a byte array of length 4.");
    }
    
    const buffer = new ArrayBuffer(4); 
    const view = new DataView(buffer);
    const byteArrayView = new Uint8Array(buffer);

    byteArrayView.set(byteArray);

    return view.getFloat32(0, true); 
}