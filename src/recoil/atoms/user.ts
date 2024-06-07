import { atom } from 'recoil';
import Cookies from 'js-cookie';

const userDataFromCookies = Cookies.get('user');
const user = userDataFromCookies ? JSON.parse(userDataFromCookies) : null;

const userState = atom({   
    key: 'userState',
    default: {
        name: user?.name || 'Varchasva Arora',
        id: user?.id || null,
        email: user?.email || null,
        isSubscribed: user?.isSubscribed || false,
        imageUrl: user?.imageUrl || 'https://lh3.googleusercontent.com/a/ACg8ocJwFZuFZgRFSmjJLNuL1SyHjAJEZKOKDlUDuGw6MGZDnJ3nOMzP=s96-c'
    } || {
        name: 'Varchasva Arora',
        id: null,
        email: null,
        isSubscribed: false,
        imageUrl: null
    },
});

export default userState;