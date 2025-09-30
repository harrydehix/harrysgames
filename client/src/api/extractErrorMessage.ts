import { AxiosError } from "axios";

export default function extractErrorMessage(error: unknown) {
    let message = "Oopss... something went wrong!";

    if (error instanceof AxiosError) {
        if (error.response) {
            message = error.response.data.message;

            if (error.response.data.message instanceof Array) {
                message = error.response.data.message[0];
            }
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    return message;
}
