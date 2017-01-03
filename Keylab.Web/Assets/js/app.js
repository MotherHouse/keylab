(function (win) {
    var utils = {
        ajax: function (options) {
            options.data || (options.data = {});
            options = $.extend({}, {
                url: "",
                data: {},
                //������Ϣ
                debug: false,
                async: false,
                succe: function (m) {
                    console.info('debug message');
                    console.log('\t', 'quest', options);
                    console.log('\t', 'ponse', m);
                }
            }, options);
            $.AMUI.progress && $.AMUI.progress.start();

            var aj = $.ajax({
                url: options.url,
                timeout: 5000,
                type: 'post',
                data: options.data,
                dataType: 'json',
                async: options.async,
                success: function (data) {
                    $.AMUI.progress && $.AMUI.progress.done();
                    if (options.debug) {
                        console.info('debug message');
                        console.log('\t', 'quest', options);
                        console.log('\t', 'ponse', data);
                    }
                    if (data.status == -1) {
                        setTimeout(function () {
                            utils.msgErr('�û���Ϣ��֤ʧ��,�����µ�¼', function () {
                                window.location.href = '/admin/login';
                            });
                        }, 2000);
                    } else {
                        options.succe && options.succe(data);
                    }
                },
                error: function (_, status) {
                    $.AMUI.progress && $.AMUI.progress.done();
                    console.log(status, _.responseText);
                    aj.abort();
                    if (status == 'timeout') {
                        utils.msgErr('��ͼ��ʾ:<br/>���糬ʱ');
                    } else {
                        utils.msgErr('��ͼ��ʾ:<br/>�����ƺ�����������');
                    }
                    //window.location.href="/"
                }
            });
        },

        /*
         * @description �ۺ���Ϣ��ʾ
         * @param msg ��ʾ��Ϣ
         * @param i ��ʾͼ��
         * @param call �ص�����
         */
        msg: function (msg, i, call) {
            if (i) {
                layer.msg(msg, { offset: '15%', icon: i, time: 2500 }, call);
            } else {
                layer.msg(msg, { offset: '15%', time: 2500 }, call);
            }
        },
        /*
         * @description �ɹ���Ϣ��ʾ
         * @param msg ��ʾ��Ϣ
         * @param i ��ʾͼ��
         * @param call �ص�����
         */
        msgOk: function (msg, call) {
            layer.msg(msg, { offset: '15%', icon: 6, time: 2000 }, call);
        },
        /*
         * @description ������Ϣ��ʾ
         * @param msg ��ʾ��Ϣ
         * @param call �ص�����
         */
        msgErr: function (msg, call) {
            layer.msg(msg, { offset: '15%', icon: 5, time: 3000 }, call);
        },
        /*
         * @description ��ʽ����λ 0 --> 00
         */
        bit2: function (v) {
            if (v < 10 || (v + '').length < 2) {
                return '0' + v;
            } else return v;
        },
        /*
         * @description ��ʽ������ -->2016-08-01
         */
        fmtDate: function (v) {
            if (!v || v == '0001-01-01T00:00:00Z') return '';
            var dt = new Date(v);
            return dt.getFullYear() + '-' + this.bit2(dt.getMonth() + 1) + '-' + this.bit2(dt.getDate());
        },
        /*
         * @description ��ȡ��ǰʱ�� ==>2016-08-01
         */
        getDate: function () {
            var dt = new Date();
            return dt.getFullYear() + '-' + this.bit2(dt.getMonth() + 1) + '-' + this.bit2(dt.getDate());
        },
        subStr: function (str, len) {
            if (str.length <= len) {
                return str;
            }
            return str.substr(0, len) + '...';
        },
        isURL: function (str_url) {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp��user@
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP��ʽ��URL- 199.194.52.184
            + "|" // ����IP��DOMAIN��������
            + "([0-9a-z_!~*'()-]+\.)*" // ����- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // ��������
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // �˿�- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            return re.test(str_url)
        }
    }
    win.utils = utils;
})(window);


function login() {
    var $num = $("#num");
    var $pass = $("#pass");
    if ($num.val().trim() == '') {
        utils.msgErr('�������˺�');
        $num.focus();
        return
    }
    if ($pass.val().trim() == '') {
        utils.msgErr('����������');
        $pass.focus();
        return
    }
    utils.ajax({
        url: "/admin/login/login",
        data: { num: $num.val().trim(), pass: md5($pass.val().trim()) },
        succe: function (data) {
            if (data.status == 1) {
                utils.msgOk('��½�ɹ�', function () {
                    location.href = '/admin/index/index';
                });
            } else {
                utils.msgErr(data.message);
            }
        }
    });
}
