//d.fy base. common variables
var

//page language (kr|en|jp)
lang = 'en',
    langCamel = 'En',

    //mode. 'index', 'project', 'about', 'news', 'people', 'contact' ...
    mode = 'index',

    //size mode. 'wide'(1920~), desktop'(1280~), 'notebook'(961~1280), 'tablet'(641~960), 'mobile'(401~640), 'mini'(~400)
    //'mini' size is changed from 320 to 360 at 140714.
    //'mini' size is changed again from 360 to 400 at 140912 for galaxy note 2.
    sizemode = 'desktop',
    prevsizemode = '',

    //view mode.
    viewmode = false,
    viewmodeid = -1,
    viewmodedata = {},

    //side content mode
    sidemode = '',
    sidemodeid = -1,

    //body size
    areawidth = window.innerWidth || document.documentElement.offsetWidth,
    areaheight,
    areaprevwidth = 0,

    basewidth = 1280,
    baseheight = 768,

    //check
    isindex = true,
    isretina = false, // check in d.fy.js checkfont()
    islocal = !(/^http/).test(location.href) || location.href.indexOf('dfy.kr') != -1,
    isfulllayout = false,


    //data caches
    datacaches = {},


    //roots
    siteorigin = F.getlocationorigin(),
    imgroot = (islocal) ? './images/' : '/images/',
    dataroot = (islocal) ? './data/' : '/data/',
    uploadroot = (islocal) ? './uploads/' : '/uploads/',

    //list default view(grid|list). use local storage.
    listdefaultview = D.data.get('listdefaultview') || 'grid',


    //top link cases
    toplinkcases = {
        index: ['projectrequest', 'careers'],
        project: ['projectrequest'],
        about: ['projectrequest', 'careers'],
        news: ['projectrequest', 'careers'],
        people: ['careers'],
        office: ['projectrequest', 'careers'],
        contact: [],
        '404': ['projectrequest', 'careers']
    },

    //bottom banner cases
    bannercases = {
        project: ['request'],
        projectview: [],
        about: ['contactus', 'facebook' /*, 'theoffice', 'joinus', 'meettheteam', 'request'*/ ],
        news: [],
        newsview: [],
        people: ['theoffice', 'joinus'],
        peopleview: [],
        office: ['meettheteam', 'facebook'],
        contact: []
    },

    //icon strings
    icons = {
        email: {
            name: 'Email',
            icon: '&#x2709;',
            color: '#626262'
        },
        site: {
            name: 'Site',
            icon: '&#x1F30E;',
            color: '#626262'
        },
        facebook: {
            name: 'Facebook',
            icon: '&#xF610;',
            color: '#3c5a96'
        },
        twitter: {
            name: 'Twitter',
            icon: '&#xF611;',
            color: '#1caceb'
        },
        googleplus: {
            name: 'Google plus',
            icon: '&#xF613;',
            color: '#d94c3f'
        },
        instagram: {
            name: 'Instagram',
            icon: '&#xF641;',
            color: '#427399'
        },
        behance: {
            name: 'Behance',
            icon: '&#xF661;',
            color: '#1147fa'
        },
        pinterest: {
            name: 'Pinterest',
            icon: '&#xF650;',
            color: '#c72632'
        },
        dribble: {
            name: 'Dribbble',
            icon: '&#xF660;',
            color: '#e74f89'
        },
        blog: {
            name: 'Blog',
            icon: '&#xF622;',
            color: '#666666'
        }
    },


    //link buttons info
    linkmap = {
        qrcode: {
            c: 'qr',
            t: 'QR Code'
        },
        launch: {
            c: 'link',
            i: '&#x1F4BB;',
            t: {
                kr: '사이트 바로가기',
                en: 'Launch Site',
                jp: 'Launch Site'
            }
        },
        download: {
            c: 'link',
            i: '&#xEB01;',
            t: {
                kr: '다운로드',
                en: 'Download',
                jp: 'Download'
            }
        },
        apple: {
            c: 'link ss',
            i: '&#xF8FF;',
            t: {
                kr: '앱스토어',
                en: 'App Store',
                jp: 'App Store'
            }
        },
        windows: {
            c: 'link ss',
            i: '&#xF6F2;',
            t: {
                kr: '윈도우즈 모바일',
                en: 'Windows Mobile',
                jp: 'Windows Mobile'
            }
        },
        android: {
            c: 'link ss',
            i: '&#xF6F3;',
            t: {
                kr: '안드로이드 마켓',
                en: 'Android Market',
                jp: 'Android Market'
            }
        },
        blackberry: {
            c: 'link ss',
            i: '&#xF6F4;',
            t: {
                kr: '블랙베리 월드',
                en: 'BlackBerry World',
                jp: 'BlackBerry World'
            }
        },
        pdf: {
            c: 'link',
            i: '&#xEB01;',
            t: {
                kr: 'PDF 다운로드',
                en: 'PDF Download',
                jp: 'PDF Download'
            }
        }
    },


    dfyinfo = {
        url: 'http://www.dfy.co.kr/',
        // logo: imgroot +'favicon/og-logo.jpg',
        logo: 'images/favicon/og-logo.jpg?_' + new Date().getTime(),
        introduce: {
            kr: '사람의 감성을 닮은 디자인에 디지털 기술을 더함으로써 고객의 비즈니스에 필요한 아름답고도 유용한 최신의 크리에이티브 솔루션을 한발 앞서 제공합니다.',
            en: 'We expertise in comprehensive design services with insights and prestigious technology.',
            jp: 'We expertise in comprehensive design services with insights and prestigious technology.'
        },
        tel: '545.2560',
        fax: '540.2560',
        email: 'hello@dfy.co.kr',
        instagramid: '1441409062',
        address: {
            kr: '주식회사 디파이 <br>서울시 강남구 강남대로 146길 37 <br>매틴빌딩 2/3층',
            en: 'D.FY Inc <br>37, Gangnam-daero 146-gil, <br>Gangnam-gu, Seoul',
            jp: 'ソウル特別市江南区江南大路１４６道３７<br>ディ.ファイInc'
        }
    },


    //d.fy sns links
    dfysns = {
        facebook: 'https://www.facebook.com/thedfy',
        instagram: 'http://instagram.com/d.frames',
        blog: 'http://dfyinc.blog.me/'
        // behance: 'http://www.behance.net/thedfy',
        // pinterest: 'http://www.pinterest.com/thedfy',
        // twitter: 'https://twitter.com/thedfy'
    },


    fixeditems = {
        people: [
            /*{
kr: 'D.FY는 국내외 다양한 수상 경력이 있습니다.',
en: 'D.FY is an award winning interactive leading worldwide.',
jp: 'D.FYは全世界の様々な国で受賞経歴があります。'
}*/
        ]
    },


    //common label texts by language
    labels = {

        'kr': {

            weare: '디파이 더 커런트', //<br>크리에이티브 스튜디오',

            aside: {
                home: '홈',
                project: '프로젝트',
                about: '회사소개',
                news: '뉴스',
                people: '디파이 사람들',
                office: '디파이 공간',
                contact: '연락처',
                career: '채용정보',
                request: '프로젝트 의뢰',
                copyright: '2014 © 디파이<br>크리에이티브 스튜디오'
            },

            required: '필수입력',

            list: {
                featured: '주요 프로젝트',
                viewdetail: '자세히 보기',
                archive: {
                    project: '전체 프로젝트',
                    news: '전체 뉴스'
                },
                gridview: '그리드 보기',
                lineview: '목록 보기',
                catebtn: '타입별 보기',
                cateall: {
                    project: '전체 프로젝트',
                    news: '전체 뉴스'
                },
                continuereading: '계속 보기',
                loadmore: {
                    project: '프로젝트 더 불러오기',
                    news: '뉴스 더 불러오기'
                }
            },

            button: {
                projectrequest: '프로젝트 의뢰',
                careers: '채용 정보',
                totop: '위로',
                share: '공유',
                backtoabout: '소개로 돌아가기',
                backtopeople: '멤버 목록으로 돌아가기',
                backtoproject: '프로젝트 목록으로 돌아가기',
                backtonews: '뉴스 목록으로 돌아가기',
                prevproject: '과거 프로젝트',
                nextproject: '최신 프로젝트',
                prevnews: '과거 뉴스',
                nextnews: '최신 뉴스'
            },

            career: {

                h3: '채용 정보',
                h4: '디파이에 지원해주세요.',
                ment: '디파이는 항상 훌륭한 인재에 관심이 있습니다. <br>즐거운 열정과 긍정의 마인드로 디파이와 함께 성장하실 당신을 기다립니다. <br>아래 양식을 통해 지원해주세요.',

                role: '주요 업무',
                require: '자격사항',
                name: '이름',
                age: '나이',
                email: '이메일',
                tel: '연락처',
                url: 'URL',
                message: '남기실 말',
                question: '디지털이 좋은 이유는?',
                upload: '파일 업로드<span>(PDF, Zip max 10MB)</span>',
                mobileupload: '파일 업로드는 PC에서만 가능합니다.',
                lastment: '디파이에 지원해주셔서 감사드립니다.',

                able: '지원하기',
                unable: '채용 중이 아닙니다.',

                form: {
                    success: '지원서가 등록되었습니다.\n디파이에 지원해주셔서 감사드립니다.'
                }

            },

            request: {

                h3: '프로젝트 의뢰',
                h4: '디파이는 항상 고객과 함께합니다.',
                ment: '미래 파트너로 디파이를 고려해주셔서 감사합니다. <br>아래 양식을 작성해주시면 빠르게 연락드리겠습니다.',

                name: '이름',
                companyName: '회사명',
                email: '이메일',
                tel: '연락처',
                url: 'URL',
                interested: '어떤 서비스를 원하십니까?',
                interestedment: '다중선택',
                interestederror: '원하시는 서비스 종류를 선택해주세요.',
                description: '귀사의 프로젝트를 설명해주세요.',
                budget: '프로젝트 예산은 어떻게 됩니까?',
                period: '일정은 언제까지인가요?',
                upload: '파일 업로드<span>(PDF, Zip max 10MB)</span>',
                mobileupload: '파일 업로드는 PC에서만 가능합니다.',
                dontworry: '빠른 시간내에 답변드리겟습니다.',
                lastment: '귀사의 미래 파트너로 디파이를 고려해주셔서 다시 한번 감사드립니다. <br>양식을 작성해주신 날부터 2일 이내에 연락드리겠습니다.',

                submit: '의뢰하기',

                form: {
                    success: '프로젝트 문의가 등록되었습니다.\n귀사의 미래 파트너로 디파이를 고려해주셔서 다시 한번 감사드립니다.'
                }

            },

            contactus: {

                title1: '연락처',
                title2: '메시지를 보내주세요 <span></span>',
                title3: '디파이 소셜네트워크',

                name: '이름',
                email: '이메일',
                phone: '전화번호',
                message: '메시지',
                looksides: '프로젝트 의뢰 또는 입사 지원을 하시려면 아래 해당 메뉴를 이용해주세요.',
                requestform: '프로젝트 의뢰 양식',
                careerform: '입사 지원 양식',
                submit: '메시지 보내기',

                followment: '다양한 SNS에서 디파이를 만나보세요:',

                form: {
                    success: '메시지가 발송되었습니다.'
                }

            },

            privacypolicy: '<a href="#privacypolicy" class="btn-full-layer-privacypolicy">개인정보보호정책</a> 에 동의합니다.',
            privacypolicyerror: '개인정보보호정책을 확인해주세요.',
            privacypolicycontents: [
                '<div class="header">',
                '<h2>개인 정보 보호 정책</h2>',
                '<p class="updated">최종 수정 날짜: 2014년 8월 28일</p>',
                '</div>',
                '<h3>개인정보 수집이용에 대한 동의</h3>',
                '<p>회원님의 소중한 개인정보는 다음과 같은 정책에 따라 수집 및 이용됩니다. 저희 디파이에서는 해당 목적에 연관되는 개인정보만을 수집하며, 수집된 정보를 투명하고 안전하게 보호 관리할 것을 약속합니다. 이에 개인정보 수집및 이용에 대한 동의를 구합니다.</p>',
                '<h3>개인정보의 수집·이용 목적</h3>',
                '<ul>',
                '<li>· 회원님의 프로젝트에 대한 견적, 기간, 개발방법 등의 문의에 대한 정보가 보다 정확한 답변을 위해 수집됩니다.</li>',
                '<li>· 상시 인력채용을 위한 인재풀 유지를 위해 지원자의 개인정보가 수집됩니다.</li>',
                '</ul>',
                '<h3>수집항목</h3>',
                '<ul>',
                '<li>· 필수항목: 성명, 나이, 회사명, 웹사이트, 연락처, 이메일, 의뢰내용, 예산, 첨부파일</li>',
                '<li>· 선택항목: 홈페이지</li>',
                '</ul>',
                '<h3>보유이용기간</h3>',
                '<p>원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>',
                '<ul>',
                '<li>· 보존 이유 : 회원님의 동의를 통한 인재정보 유지</li>',
                '<li>· 보존 기간 : 회원정보 삭제 요청시까지</li>',
                '</ul>',
                '<h3>동의를 거부할 권리 및 동의를 거부할 경우의 이익</h3>',
                '<p>위 개인정보 중 필수적 정보의 수집•이용에 관한 동의는 채용 심사를 위하여 필수적이므로, 위 사항에 동의하셔야만 채용심사가 가능합니다. 위 개인정보 중 선택적 정보의 수집•이용에 관한 동의는 거부하실 수 있으며, 다만 동의하지 않으시는 경우 채용 심사시 불이익을 받으실 수 있으며, 「동의하지 않음」을 선택한 후 본인이 등록한 선택적 정보에 대해서는 수집 • 이용에 대해 동의한 것으로 간주합니다.</p>'
            ].join(''),

            error: {
                ajax: '전송 실패. 다시 시도해주세요.',
                fileuploadexceed: '파일 용량이 초과되었습니다.',
                fileuploadextension: '업로드를 지원하지 않는 파일 형식입니다.'
            },

            banner: {
                meettheteam: {
                    title: '팀을 만나보세요.',
                    ment: '각 분야에서 탁월한 디파이의 팀을 소개합니다.',
                    linktxt: '더 알아보기'
                },
                contactus: {
                    title: '상담해보세요.',
                    ment: '크리에이티브 스튜디오 디파이와 만나보세요.',
                    linktxt: '저희에게 연락하십시오.'
                },
                theoffice: {
                    title: '사무실을 소개합니다.',
                    ment: '디파이는 자유롭고 크리에이티브한 공간입니다.',
                    linktxt: '더 알아보기'
                },
                joinus: {
                    title: '팀에 합류해 보세요.',
                    ment: '더 많은 작업들을 함께할 수 있습니다.',
                    linktxt: '더 알아보기'
                },
                request: {
                    title: '프로젝트를 구상중이신가요?',
                    ment: '상담해 보세요. 크리에이티브 스튜디오 디파이가 함께 합니다.',
                    linktxt: '시작해봅시다'
                },
                facebook: {
                    title: '좋아요',
                    linktxt: '디파이 페이스북 페이지'
                }
            },

            careers: '주요 경력',

            footer: {
                tel: '전화 02 545 2560<br>팩스 02 540 2560',
                address: '서울시 강남구 강남대로 146길 37 <br>매틴빌딩 2층/3층<br>주식회사 디파이',
                copyright: '2014 © 디파이 크리에이티브 스튜디오.<br>모든 이미지와 비디오의 저작권은 (주)디파이에 있습니다.'
            }

        },

        'en': {

            weare: 'Defy the Current', //<br>Creative Studio',

            aside: {
                home: 'Home',
                project: 'Projects',
                about: 'About',
                news: 'News',
                people: 'Meet the team',
                office: 'D.FY office',
                contact: 'Contact us',
                career: 'Careers',
                request: 'Request a Project',
                copyright: '2014 © <em>D.</em>FY<br>Creative Studio'
            },

            required: 'Required',

            list: {
                featured: 'Featured Pojects',
                viewdetail: 'View case studies',
                archive: {
                    project: 'Archive Projects',
                    news: 'All News'
                },
                gridview: 'View as Grid',
                lineview: 'View as List',
                catebtn: 'View by Type',
                cateall: {
                    project: 'All Projects',
                    news: 'All News'
                },
                continuereading: 'Continue reading',
                loadmore: {
                    project: 'Load more Projects',
                    news: 'Load more News'
                }
            },

            button: {
                projectrequest: 'Request a Project',
                careers: 'Careers',
                totop: 'Back to Top',
                share: 'Share',
                backtoabout: 'Back to About',
                backtopeople: 'Back to People',
                backtoproject: 'Back to Projects',
                backtonews: 'Back to News',
                prevproject: 'Older Project',
                nextproject: 'Newer Project',
                prevnews: 'Older News',
                nextnews: 'Newer News'
            },

            career: {

                h3: 'Careers',
                h4: 'Work with us.',
                ment: 'Are you interested in joining us? We’re always looking for highly-skilled employees with positive attitudes to become part of the team. See below for a list of current openings, and feel free to send us your resume.',

                role: 'Role and Responsibilities',
                require: 'Requirements',
                name: 'Your name',
                age: 'Your Age',
                email: 'Your e-mail',
                tel: 'Phone number',
                url: 'URL',
                message: 'Your message',
                question: 'What makes you fall in love of the digital?',
                upload: 'Upload<span>(PDF, Zip max 10MB)</span>',
                mobileupload: 'File upload only can be via PC.',
                lastment: 'Thank you for considering D.FY for your career',

                able: 'Apply for this job',
                unable: 'Now do not recruit staff...',

                form: {
                    success: 'Your resume is regsitered successfully. \nThank you for applying.'
                }

            },

            request: {

                h3: 'Request a Project',
                h4: 'Partner with us.',
                ment: 'Do you have a project we can help you with? We’re happy to provide a free consultation at your convenience. <br>Simply fill out the form below, and we’ll be in touch as soon as possible.',

                name: 'Your name',
                companyName: 'Organization',
                email: 'Your e-mail',
                tel: 'Phone number',
                url: 'URL',
                interested: 'What services are you interested in?',
                interestedment: 'Multiselection',
                interestederror: 'Please choose services you are interested in.',
                description: 'Describe your project',
                budget: 'What is your project\'s budget?',
                period: 'What is your project\'s timeline?',
                upload: 'Upload<span>(PDF, Zip max 10MB)</span>',
                mobileupload: 'File upload only can be via PC.',
                dontworry: 'Don\'t worry, we won\'t hold you to it.',
                lastment: 'Thank you for considering D.FY for your upcoming project.<br>Please fill out this short form and we’ll get back to you within two business days.',

                submit: 'Submit request',

                form: {
                    success: 'Project inquiry is successfully registered. \nThank you for considering D.FY as future partner.'
                }

            },

            contactus: {

                title1: 'Contact',
                title2: 'Send us a Message <span></span>',
                title3: 'Follow us',

                name: 'Your name',
                email: 'Your e-mail',
                phone: 'Phone number',
                message: 'Your message',
                looksides: 'If you are inquiring about a project please',
                requestform: 'Project Request Form',
                careerform: 'Careers Form',
                submit: 'Submit message',

                followment: 'Meet at D.FY variety of SNS:',

                form: {
                    success: 'Your message has been sent successfully.'
                }

            },

            privacypolicy: 'I accept the terms of the <a href="#privacypolicy" class="btn-full-layer-privacypolicy">privacy policy</a> and I agree',
            privacypolicyerror: 'Please accept the terms of the privacy policy',
            privacypolicycontents: [
                '<div class="header">',
                '<h2>Privacy policy</h2>',
                '<p class="updated">Last Update: August 28, 2014</p>',
                '</div>',
                '<h3>Consent for the sharing of personal information</h3>',
                '<p>Your privacy is very important, and all information collected will be handled responsibly.  An effort will be made to be as open and transparent as possible with how your information is handled. D.FY hereby asks for your consent on sharing personal information.</p>',
                '<h3>Purpose of personal information</h3>',
                '<ul>',
                '<li>· We collect information of the project’s budget, timeline and development process to provide better answer for you request.</li>',
                '<li>· We collect and conserve applicants’s personal information for the future recuritment purpose.</li>',
                '</ul>',
                '<h3>List of information</h3> ',
                '<ul>',
                '<li>· Mendatory : Name, Age, Company, Phone number, Email address, Content of the request</li>',
                '<li>· Optional : Website url</li>',
                '</ul>',
                '<h3>Effective Period</h3>',
                '<p>In principle, the information will be destroyed after achieving the goal explained above. But for the cases below, the information will be conserved for the period notified.</p>',
                '<ul>',
                '<li>· purpose : The personal information for job recruitment will be conserved.</li>',
                '<li>· period : Until the applicant request to destroy the information.</li>',
                '</ul>',
                '<h3>The applicant’s right to refuse consent and the consequence</h3>',
                '<p>Consent for collecting and sharing personal information is mendatory for evaluation. You have a right to refuse the consent, but you may receive disadvatage on recruitment evaluation.</p>'
            ].join(''),

            error: {
                ajax: 'Failed to save. Please try again.',
                fileuploadexceed: 'File has exceeded the maximum capacity.',
                fileuploadextension: 'File format is not supported.'
            },

            ajaxerror: 'Failed to save. Please try again.',

            banner: {
                meettheteam: {
                    title: 'Meet the team',
                    ment: 'We are multidisciplinary team of excellence.',
                    linktxt: 'Forward'
                },
                contactus: {
                    title: 'Talk to us',
                    ment: 'We’d love to hear from you.',
                    linktxt: 'Forward'
                },
                theoffice: {
                    title: 'Tour our workspace',
                    ment: 'D.FY studio, a environment as creative as our work.',
                    linktxt: 'Forward'
                },
                joinus: {
                    title: 'Join the team',
                    ment: 'See our current open positions.',
                    linktxt: 'Forward'
                },
                request: {
                    title: 'Partner with us',
                    ment: 'Do you have a project we can help you with?',
                    linktxt: 'Forward'
                },
                facebook: {
                    title: 'Like us on',
                    linktxt: 'Forward'
                }
            },

            careers: 'Careers',

            footer: {
                tel: 'Call +82 2 545 2560<br>Fax +82 2 540 2560',
                address: 'D.FY Inc 37, Gangnam-daero 146-gil, Gangnam-gu, Seoul',
                copyright: '2014 © D.FY Creative Studio.<br>All rights reserved. All images and videos are copyrighted.'
            }

        },

        'jp': {

            weare: 'Defy the Current', //<br>Creative Studio',

            aside: {
                home: 'ホーム',
                project: 'プロジェクト',
                about: '会社紹介',
                news: 'ニュース',
                people: 'D.FYの人々',
                office: 'D.FYのスペース',
                contact: '問合せ／連絡先',
                career: '採用情報',
                request: 'プロジェクト依頼',
                copyright: '2014 © <em>ディ.</em>ファイ<br>クリエイティブスタジオ'
            },

            required: '必須入力',

            list: {
                featured: '重要プロジェクト',
                viewdetail: 'プロジェクトの詳細を見る',
                archive: {
                    project: 'アーカイブプロジェクト',
                    news: 'すべてのニュース'
                },
                gridview: 'グリッドで見る',
                lineview: 'リストで見る',
                catebtn: 'タイプで見る',
                cateall: {
                    project: 'すべてのプロジェクト',
                    news: 'すべてのニュース'
                },
                continuereading: '続きを見る',
                loadmore: {
                    project: 'プロジェクトもっと見る',
                    news: 'ニュースもっと見る'
                }
            },

            button: {
                projectrequest: 'プロジェクト依頼',
                careers: '採用情報',
                totop: 'トップへ行く',
                share: '共有',
                backtoabout: '会社紹介に戻る',
                backtopeople: 'D.FYの人々に戻る',
                backtoproject: 'プロジェクトに戻る',
                backtonews: 'ニュースに戻る',
                prevproject: '이전 프로젝트',
                nextproject: '다음 프로젝트',
                prevnews: '이전 뉴스',
                nextnews: '다음 뉴스'
            },

            career: {

                h3: '採用情報',
                h4: 'D.FYと一緒にやりましょう',
                ment: 'D.FYは常に、素晴らしい人材に関心を持っています。<br>楽しむ情熱と前向きなマインドでD.FYと一緒に成長する<br>あなたを待っています。',

                role: '重要業務',
                require: '資格事項',
                name: '名前',
                age: '年齢',
                email: 'eメール',
                tel: '連絡先',
                url: 'URL',
                message: 'メッセージ',
                question: 'デジタルが好きな理由は？',
                upload: 'ファイルアップロード<span>(PDF, Zip max 10MB)</span>',
                mobileupload: 'ファイルのアップロードはPCでのみ可能です。',
                lastment: 'D.FYに応募してくれてありがとうございます。',

                able: '応募する',
                unable: '採用中ではありません',

                form: {
                    success: '応募が完了しました。'
                }

            },

            request: {

                h3: 'プロジェクト依頼',
                h4: 'D.FYは共にやります',
                ment: '未来のパートナーにD.FYを考えてくださってありがとうございます。 <br>下の様式を作成していただければすぐにご連絡致します。',

                name: '名前',
                companyName: '組織名',
                email: 'eメール',
                tel: '連絡先',
                url: 'URL',
                interested: 'どのようなサービスを望みますか?',
                interestedment: '複数選択',
                interestederror: '欲しいサービスを選択してください。',
                description: 'プロジェクトを説明してください。',
                budget: 'プロジェクトの予算はどのくらいですか？',
                period: 'プロジェクトの期間はどのくらいですか？',
                upload: 'ファイルアップロード<span>(PDF, Zip max 10MB)</span>',
                mobileupload: 'ファイルのアップロードはPCでのみ可能です。',
                dontworry: '素早く返事します。',
                lastment: '未来パートナーでD.FYを選択してくれてありがとうございます。<br>2日以内に連絡します。',

                submit: '依頼する',

                form: {
                    success: 'プロジェクト依頼が登録されました。\n未来パートナーでD.FYを選択してくれてありがとうございます。'
                }

            },

            contactus: {

                title1: 'お問い合わせ',
                title2: 'メッセージを送ってください。 <span></span>',
                title3: 'D.FYソーシャルネットワーク',

                name: '名前',
                email: 'eメール',
                phone: '連絡先',
                message: 'メッセージ',
                looksides: 'プロジェクト依頼もしくは入社希望の方は以下のメニューを利用してください。',
                requestform: 'プロジェクト依頼フォーム',
                careerform: '採用情報フォーム',
                submit: 'メッセージを送る',

                followment: '様々なSNSでD.FYと会いましょう',

                form: {
                    success: 'メッセージを送りました。'
                }

            },

            privacypolicy: '<a href="#privacypolicy" class="btn-full-layer-privacypolicy">個人情報保護方針</a>に同意します。',
            privacypolicyerror: '日語Please accept the terms of the privacy policy',
            privacypolicycontents: [
                '<div class="header">',
                '<h2>Privacy policy</h2>',
                '<p class="updated">Last Update: August 28, 2014</p>',
                '</div>',
                '<h3>Consent for the sharing of personal information</h3>',
                '<p>Your privacy is very important, and all information collected will be handled responsibly.  An effort will be made to be as open and transparent as possible with how your information is handled. D.FY hereby asks for your consent on sharing personal information.</p>',
                '<h3>Purpose of personal information</h3>',
                '<ul>',
                '<li>· We collect information of the project’s budget, timeline and development process to provide better answer for you request.</li>',
                '<li>· We collect and conserve applicants’s personal information for the future recuritment purpose.</li>',
                '</ul>',
                '<h3>List of information</h3> ',
                '<ul>',
                '<li>· Mendatory : Name, Age, Company, Phone number, Email address, Content of the request</li>',
                '<li>· Optional : Website url</li>',
                '</ul>',
                '<h3>Effective Period</h3>',
                '<p>In principle, the information will be destroyed after achieving the goal explained above. But for the cases below, the information will be conserved for the period notified.</p>',
                '<ul>',
                '<li>· purpose : The personal information for job recruitment will be conserved.</li>',
                '<li>· period : Until the applicant request to destroy the information.</li>',
                '</ul>',
                '<h3>The applicant’s right to refuse consent and the consequence</h3>',
                '<p>Consent for collecting and sharing personal information is mendatory for evaluation. You have a right to refuse the consent, but you may receive disadvatage on recruitment evaluation.</p>'
            ].join(''),

            error: {
                ajax: '転送に失敗しました。もう一度お願いします。',
                fileuploadexceed: 'ファイル容量が大きいです',
                fileuploadextension: 'アップロードできないファイル形式です。.'
            },

            banner: {
                meettheteam: {
                    title: 'チームに会ってみてください。',
                    ment: 'プランナー、デザイナー、コーダー、プログラマーなど各分野から卓越したD.FYのチームを紹介します。',
                    linktxt: '詳細を見る'
                },
                contactus: {
                    title: '相談してください。',
                    ment: 'クリエイティブスタジオD.FYと会ってみませんか。',
                    linktxt: '私たちにご連絡ください。'
                },
                theoffice: {
                    title: 'D.FY　オフィス',
                    ment: 'D.FYは素敵なレストランとユニークなショッピングが立ち並ぶカロスキルに隣接しています。',
                    linktxt: '詳細を見る'
                },
                joinus: {
                    title: 'チームに合流しませんか',
                    ment: 'あなたは私たちの仕事をもっと見たくなります。',
                    linktxt: '採用情報'
                },
                request: {
                    title: '日語Got a project in mind?',
                    ment: '日語We can hit the ground running fastest if you’ll give me.',
                    linktxt: '日語Let’s get started'
                },
                facebook: {
                    title: 'いいね！',
                    linktxt: 'D.FYのFacebook'
                }
            },

            careers: '日語Careers',

            footer: {
                tel: '電話 +82 2 545 2560<br>ファックス +82 2 540 2560',
                address: 'ソウル特別市江南区江南大路146道37 <br>ディ.ファイ Inc',
                copyright: '2014 © ディ.パイ クリエイティブスタジオ<br>All rights reserved. All images and videos are copyrighted.'
            }

        }

    },

    functions = {
        scroll: [],
        resize: [],
        call: function(name, value) {
            for (var i = 0, max = functions[name].length; i < max; i++) {
                functions[name][i](value);
            }
        },
        empty: function() {
            this.scroll = [];
            this.resize = [];
        }
    },

    //pubsub event constants
    EVENTS = {
        READY: 'element.ready',
        SHOW: 'element.show',
        HIDE: 'element.hide',
        SCROLL: 'element.scroll'
    };


//remove sharing url
if (location.href.indexOf('?!') != -1) {
    location.href = location.href.replace('?!', '#!');
}
