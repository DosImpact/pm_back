```js
# 1. multer을 이용한. 파일 업로드

npm install multer

# 서버 사이드, 파일 받을 준비 ( 참고 :  multer에 multer S3 를 장착하면, 파일이 AWS S3로 올라간다. )

	- 미들웨어 +> multer처리 > 그 결과를 컨트롤할 두 함수 정의한다. > 미들웨어 장착

import { uploadContoller, uploadMiddleware } from "./upload";


server.express.post("/api/upload", uploadMiddleware, uploadContoller);


	- single(" [필드 이름] ")  하나의 필드를 처리한다. ( 파일을 보낼때 필드를 정해서 다르게 처리 )
	- fields 은 여러개의 필드를 처리하도록 배열 형태를 제공
	- dest : 저장될 목적지
	- storage : 목적지 지정 callback으로 오류없이, 해당 경로 ( 위의 dest가 무시된다. )
	- filename : 원래 이름에서 확장자를  때고, 현재 파일 이름에 + 날짜를 적어 (중복방지) 저장한다. > callback처리


	- req.file 에 업로드한 파일 정보를 담아준다.
	- 해당 파일을 보고 추가적인 코드를 작성 ( 여기서는 json 형태로 파일 위치를 알려줌 )


import multer from "multer";
import path from "path";

export const uploadMiddleware = multer({
  dest: "upload/",
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("file");

export const uploadContoller = (req, res) => {
  console.log("upload::", req.file, req.body); // 보통은 body인데
  const { file } = req;
  console.log(file);
  res.json({ url: `/${req.file.filename}` });
  res.end();
};



# 클라이언트 사이트 ( React )


	1. 이미지 업로드 기능 2. 파일을 클라이언트에 피드백 해주기

	- 파일을 받을 input[ type = "file" ] 과, 이미지를 보여줄 img 태그를 미리 선언
	- 두 개의 state ( 하나는 multer 하나는 클라이언트 피드백 )

  const [imgBase64, setImgBase64] = useState(""); // 파일 base64
  const [img, setImage] = useState(null);

      <div
        style={{ backgroundColor: "#efefef", width: "150px", height: "150px" }}
      >
        {imgBase64 && <img src={imgBase64} width={"150px"} height={"150px"} />}
      </div>

      <form>
        <input type="file" onChange={onChange} />
        <button onClick={onClick}>제출</button>
      </form>

	- 파일이 업로드 되었을때 > FileReader 를 만든다. ( 이미지를 base64 형태로 만들어야 img에서 보임 )
	- callback함수를 걸어 변환 완료시 setSTATE를 통해 리랜더링

  const onChange = (e) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      setImage(e.target.files[0]); // multer에게 필요한 유일한 코드
    }
  };

	- Post 방식으로, content-type을 multer가 알아먹는 타임으로 바꾸고, formData 전송 끝.
	- file 이라는 multer의 필드네임과 동일해야한다.

  const onClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", img);

    try {
      const res = await Axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      console.log("res", res);
    } catch (error) {}
  };



# 2. express 이용한. 정적 파일 제공

# 서버 사이드 작업

	- 정적파일 제공을 위한 미들웨어 장착 ( 정적파일 제공 경로가 있다. )

server.express.use(express.static("public"));


	- public 폴더에, 파일을 잘 넣고, 그냥 localhost:4000/kakaotalk.jpg 이렇게 요청하면 끝!

# 클라이언트 에서 이용하기

	- 해당 주소로 src 걸면 끝
        <img
          src={`http://localhost:4000/${serverImg}`}
          width={"150px"}
          height={"150px"}
        ></img>

	- 해당 주소로 src 걸고 click까지 눌러주기 > 새로운 창에서 이미지가 나온다.
    const a = document.createElement("a");
    a.href = `http://localhost:4000/${serverImg}`;
    a.download = "Paint.jpg";
    a.target = "_blank";
    a.click();



# 3. express 이용한, 파일 다운로드 제공

# 서버 사이드 작업
	- 다운로드는 매우 간편하다. 이미 모듈을 제공한다. bodyparser를 통해 잘 원하는 파일을 알아내어 주도록하는데, 여기서는 하나의 파일을 주겠다.

server.express.get("/download", (req, res) => {
  res.download("public/lecture8.mp4");
});


	- (참고)방법 2. download의 내부적인 구조인듯, 근데 이방법 쓰면 전체 파일 크기가 안나옴

import mime from "mime";
import fs from "fs";
import path from "path";


server.express.get("/downloadstream", (req, res) => {

  let file = "public/lecture8.mp4"; // __dirname + '/upload-folder/dramaticpenguin.MOV';
  let filename = path.basename(file);
  let mimetype = mime.getType(file);
  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);
  let filestream = fs.createReadStream(file);
  filestream.pipe(res);
});


# 클라이언트 (React) 작업

	- 새로운 page에 donwload url 를 걸면 다운로드가 되는데, 현 페이지에서는 탈출해야됨.
	- 그래서 iframe 태글르 안보이게 만들어서 제공한다.

      <div>
        <h2>SERVER IMG DOWN LOAD</h2>
        <button onClick={onClickServerDown}>GIVE ME HERE</button>
      </div>

  const onClickServerDown = async () => {
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:4000/download";
    iframe.style = "dispaly:none";
    document.body.appendChild(iframe);
  };


```
