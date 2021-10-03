import React, { Component } from 'react'

type UserInfoProps = {

}

export default class UserInfo extends Component<UserInfoProps> {
    render() {
        const image = 'https://cdn.discordapp.com/avatars/353603367907360768/fb1949c8f45cbec1d2568d4bab9e874e.webp?size=32'
        const platform = 'web'
        const status = 'online'

        return (
            <section style={{
                backgroundColor: '#1111117f',
                width: '100%',
                height: 53,
                marginBottom: 22
            }}>
                <div style={{
                    padding: '0 8px',
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100%',
                    alignItems: 'inherit'
                }}>
                    <div role="img" aria-label="T0tallyR3al, Online" style={{
                        width: 32,
                        height: 32,
                        marginRight: 12,
                    }}>
                        <svg width="40" height="40" viewBox="0 4 40 32">
                            <mask id="svg-mask-avatar-status-offline"><rect width="40" height="32" fill="white"></rect><circle cx="27" cy="27" r="8.5" fill="black"></circle></mask>
                            <mask id="svg-mask-avatar-status-web"><rect width="40" height="32" fill="white"></rect><circle cx="27" cy="27" r="10" fill="black"></circle></mask>
                            <mask id="svg-mask-avatar-status-desktop"><rect width="40" height="32" fill="white"></rect><rect x="17" y="16.5" width="18" height="15.5" rx="3" fill="black"></rect></mask>
                            <mask id="svg-mask-avatar-status-mobile"><rect width="40" height="32" fill="white"></rect><rect x="19.2" y="16" width="18" height="20" rx="3" fill="black"></rect></mask>

                            <mask id="svg-mask-status-offline"><circle fill="white" r="5" cx="27" cy="27"></circle><circle cx="27" cy="27" r="2.5" fill="black"></circle></mask>
                            <mask id="svg-mask-status-web"><svg x="19" y="19" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"></path></svg></mask>
                            <mask id="svg-mask-status-desktop"><svg x="18.5" y="18" width="16" height="16" viewBox="0 0 24 24"><path fill="white" d="M4 2.5C2.897 2.5 2 3.397 2 4.5V15.5C2 16.604 2.897 17.5 4 17.5H11V19.5H7V21.5H17V19.5H13V17.5H20C21.103 17.5 22 16.604 22 15.5V4.5C22 3.397 21.103 2.5 20 2.5H4ZM20 4.5V13.5H4V4.5H20Z"></path></svg></mask>
                            <mask id="svg-mask-status-mobile"><svg x="18.5" y="18" width="18" height="18" viewBox="0 0 24 24"><g><path fill="white" d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"></path></g></svg></mask>

                            <foreignObject x="0" y="0" width="32" height="32" mask={`url(#svg-mask-avatar-status-${platform})`}>
                                <div><img width="32" height="32" src={image} alt=" " style={{ borderRadius: '100%' }}/></div>
                            </foreignObject>
                            <rect width="30" height="30" x="10" y="10" fill={status === 'online' ? 'rgb(59, 165, 93)' : status === 'idle' ? 'rgb(250, 168, 26)' : status === 'dnd' ? 'rgb(237, 66, 69)' : status === 'streaming' ? 'rgb(89, 54, 149)' : '#7f7f7f'} mask={`url(#svg-mask-status-${platform})`}/>
                        </svg>
                    </div>
                    <div style={{
                        flexGrow: 1
                    }}>
                        <span>Username</span>
                        <br/>
                        <span>Status</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexShrink: 0,
                        flexDirection: 'row'
                    }}>
                        <UserInfoButton>
                            <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z" fill="currentColor"></path></svg>
                        </UserInfoButton>
                        <UserInfoButton>
                        <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z" fill="currentColor"></path></svg></svg>
                        </UserInfoButton>
                        <UserInfoButton>
                        <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>
                        </UserInfoButton>
                    </div>
                </div>
            </section>
        )
    }
}


const UserInfoButton = ({ children }: { children: any }) => (
    <button style={{
        width: 32,
        height: 32,
        backgroundColor: 'transparent'
    }}>
        <div style={{
            height: 20
        }}>
            {children}
        </div>
    </button>
)