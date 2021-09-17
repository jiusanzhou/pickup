import Home from "../pages/home"
import Dashboard from "../pages/dashboard"
import settings from "../utils/settings"

export default [
    {
        path: '/',
        title: settings.title,
        layout: {
            name: 'default',
            header: {
                width: "full",
                fixed: true,
            },
            footer: {
                bg: ["gray.100", "gray.700"],
                fixed: true,
                width: "full"
            }
        },
        page: Home,
    },

    // 404 page
    {
        layout: 'empty',
        // title: `${settings.title} | ${document.title}`,
        title: `${document.title}`,
        page: Dashboard,
    }
]