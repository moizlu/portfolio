import { browser } from "$app/environment";

let _isWorkModalOpened = $state(false);
export const isWorkModalOpened = () => {
    return _isWorkModalOpened;
}
export const setWorkModalOpened = (value: boolean) => {
    _isWorkModalOpened = value;

    if (browser) {
        if (_isWorkModalOpened) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

    }
}
