import type { Snippet } from "svelte";

// let _dialogContent: Snippet | undefined = $state(undefined);
// let _id = $state("");
// let _priority = $state(-1);
// let _isModal = $state(false);
// let _isDrawWindow = $state(false);
// let _requireContrast = $state(false);

type DialogData = {
    content?: Snippet;
    id: string,
    priority?: number,
    isModal?: boolean,
    isDrawWindow?: boolean,
    requireContrast?: boolean
}

export class DialogManager {
    public constructor() { }


    public activate(newData: DialogData): boolean {
        const setDialog = () => {
            document.body.classList.add("overflow-hidden");
            this._data = newData;
        }

        if (this.isOpened) {
            if ((newData.priority ?? -1) >= (this.data.priority ?? -1)) {
                setDialog();
                return true;
            } else {
                return false;
            }
        } else {
            setDialog();
            return true;
        }
    }
    public deactivate(id?: string) {
        if (!id || this.data.id === id) {
            document.body.classList.remove("overflow-hidden");
            this._data.content = undefined;
        }
    }

    public get data(): Readonly<DialogData> { return this._data; }
    public get isOpened() { return this.data.content !== undefined; }
    public isActive(id: string) { return this.data.id === id; }

    private _data: DialogData = $state({
        id: "",
        priority: -1,
        isModal: false,
        isDrawWindow: true,
        requireContrast: false
    });
}

export const dialog = new DialogManager();

// export const dialog = $state({
//     _content: undefined as (Snippet | undefined),
//     _id: "",
//     _priority: -1,
//     _isModal: false,
//     _isDrawWindow: false,
//     _requireContrast: false,

//     getContent: () => dialog._content,
//     getId: () => dialog._id,
//     isModal: () => dialog._isModal,
//     isDrawWindow: () => dialog._isDrawWindow,
//     requireContrast: () => dialog._requireContrast,
//     isOpened: () => dialog._content !== undefined,
//     isActive: (id: string) => dialog._id === id,
//     activate: ({ id, content, isModal = false, isDrawWindow = true, requireContrast = true, priority = 0 }: {
//         id: string;
//         content?: Snippet;
//         isModal?: boolean;
//         isDrawWindow?: boolean;
//         requireContrast?: boolean;
//         priority?: number;
//     }) => {
//         const setDialog = () => {
//             document.body.classList.add("overflow-hidden");

//             dialog._id = id;
//             dialog._content = content;
//             dialog._priority = priority;
//             dialog._isModal = isModal;
//             dialog._isDrawWindow = isDrawWindow;
//             dialog._requireContrast = requireContrast
//         }

//         if (dialog._content) {
//             if (priority >= dialog._priority) {
//                 setDialog();

//                 return true;
//             }
//             return false
//         } else {
//             setDialog();

//             return true;
//         }
//     },
//     deactivate: (id: string | undefined = undefined) => {
//         if (!id || (dialog._id === id)) {
//             document.body.classList.remove("overflow-hidden");
//             dialog._content = undefined;
//         }
//     }
// });

// export const getDialogContent = () => _dialogContent;
// export const getDialogId = () => _id;
// export const isModal = () => _isModal;
// export const isDrawWindow = () => _isDrawWindow;
// export const requireContrast = () => _requireContrast;
// export const dialogActivate = ({ id, content, isModal = false, isDrawWindow = true, requireContrast = true, priority = 0 }: {
//     id: string;
//     content?: Snippet;
//     isModal?: boolean;
//     isDrawWindow?: boolean;
//     requireContrast?: boolean;
//     priority?: number;
// }): boolean => {
//     if (_dialogContent) {
//         if (priority >= _priority) {
//             _id = id;
//             _dialogContent = content;
//             _priority = priority;
//             _isModal = isModal;
//             _isDrawWindow = isDrawWindow;
//             _requireContrast = requireContrast;
//             return true;
//         }
//         return false;
//     } else {
//         _id = id;
//         _dialogContent = content;
//         _priority = priority;
//         _isModal = isModal;
//         _isDrawWindow = isDrawWindow;
//         _requireContrast = requireContrast;
//         return true;
//     }
// };
// export const dialogDeactivate = (id: string | undefined = undefined) => {
//     if (!id || (getDialogId() === id)) {
//         _dialogContent = undefined;
//     }
// };
