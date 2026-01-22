import { browser } from "$app/environment";

export type Theme = "light" | "dark";
export type SystemTheme = Theme | "system";

let darkModeMediaQuery: MediaQueryList | undefined = undefined;

if (browser) {
    darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
}

export const theme = {
    _theme: "light" as SystemTheme,

    init: () => {
        if (!browser) { return; }

        const cookieTheme = (localStorage.getItem("theme") ?? undefined) as Theme | undefined;

        if (cookieTheme) {
            theme._theme = cookieTheme;
        } else {
            theme._theme = "system";
            localStorage.setItem("theme", theme._theme);
        }

        theme.set(theme._theme);

        darkModeMediaQuery?.addEventListener('change', () => {
            if (theme._theme !== "system") { return; }
            theme.apply();
        })
    },

    get: () => {
        if (theme._theme === "system") {
            return (darkModeMediaQuery?.matches) ? "dark" : "light";
        } else {
            return theme._theme;
        }
    },
    getRaw: () => { return theme._theme },
    set: (t: SystemTheme) => {
        if (!browser) { return; }
        theme._theme = t;
        localStorage.setItem("theme", theme._theme);
        theme.apply();
    },

    apply: () => {
        document.body.classList.toggle("dark", theme.get() === "dark");
        document.body.style.colorScheme = theme.get();
    }
};
