export function generateOTP() {
    let OTP = Math.floor(Math.random() * 1000000);
    return OTP;
}