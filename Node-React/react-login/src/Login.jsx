import React, {useEffect} from 'react';

// 더미 데이터
const User = {
    email: 'test@example.com',
    password: 'test123456@@@'
}

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [emailValid, setEmailValid] = React.useState(false);
    const [passwordValid, setPasswordValid] = React.useState(false);
    const [notAllow, setNotAllow] = React.useState(true);

    //email 값 입력 판단
    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        if(regex.test(email)){
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    //비밀번호 값 입력 판단
    const handlePassword = (e) => {
        setPassword(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;

        if(regex.test(password)){
            setPasswordValid(true);
        }else{
            setPasswordValid(false);
        }
    }

    const onclickConfirmButton = () => {
        if(email === User.email && password === User.password) {
            alert("로그인에 성공했습니다.")
        } else{
            alert("등록되지 않은 회원입니다.")
        }
    }

    // 회원가입
    const onclickSignUpButton = () => {

    }

    // 버튼 활성화 여부 체크
    useEffect(() => {
        if(emailValid && passwordValid){
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    }, [emailValid, passwordValid]); // deps: 실행조건, 해당 배열에 속한 요소들이 변경될 때만 콜백함수 실행

    return(
        <div className="page">
            <div className="titleWrap">
                이메일과 비밀번호를
                <br/>
                입력해주세요.
            </div>

            <div className="contentWrap">
                <div className="inputTitle">이메일주소</div>

                <div className="inputWrap">
                    <input className="input" placeholder={"test@gmail.com"}
                    value={email}
                    onChange={handleEmail}
                    type = "text"/>
                </div>
                {/*에러 메시지*/}
                <div className="errorMessageWrap">
                    {
                        !emailValid && email.length > 0 && (
                            <div> 올바른 이메일을 입력해주세요.</div>
                        )
                    }
                </div>

                <div style = {{marginTop:"26px"}} className = "inputTitle">비밀번호</div>
                <div className="inputWrap">
                    <input className="input"
                    placeholder={"영문,숫자,특수문자 포함 8자 이상 입력해주세요."}
                    value={password}
                    onChange={handlePassword}
                    type = "password"/>
                </div>
                {/*에러 메시지*/}
                <div className="errorMessageWrap">
                    {
                        !passwordValid && password.length > 0 && (
                            <div>영문,숫자,특수문자 포함 8자 이상 입력해주세요.</div>
                        )
                    }
                </div>
            </div>

            <div>
                <button onClick={onclickConfirmButton} disabled={notAllow} className = "bottomButton">
                    확인
                </button>
            </div>

            <div>
                <button onClick={{onclickSignUpButton}} className = "bottomButton">
                    회원가입
                </button>
            </div>
        </div>
    )
}