module.exports = {
    'handle':[// 网络回包处理的方法类
        require('LobbyRecvMsgs'),
    ],
    'send': {
        'LobbySendMsg': [// 发给服务器的消息
            {
                'id':'ID_C2S_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_C2S_ENTER_ROOM',
                'function': 'onEnterRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_C2S_DELETE_ROOM',
                'function': 'onDeleteRoom',
                'desc': '删除房间',
            },
            {
                'id':'ID_C2S_TALK',
                'function': 'onTalk',
                'desc': '说话聊天',
            }
        ],
    },
    'recv': {
        'LobbyRecvMsgs': [// 服务器回包
            {
                'id':'ID_S2C_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_S2C_CREATE_ROOM',
                'function': 'onEnterRoom',
                'desc': '创建房间',
            },
        ],
    }


}



