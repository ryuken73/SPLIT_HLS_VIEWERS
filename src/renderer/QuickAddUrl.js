import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';
import HLSJSPlayer from './HLSJSPlayer';
import MP4Player from './MP4Player';
import YoutubeJSPlayer from './YoutubeJSPlayer';
import {replace} from './lib/arrayUtil';

const Container = styled.div`
  /* display: flex; */
`;
const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* width: calc(100% - 300px); */
  /* padding: 10px; */
  padding-top: 10px;
  justify-content: space-between;
`;
const ErrorMessage = styled.div`
  margin-top: 5px;
  font-size: 12px;
`


function AddManualUrl(props) {
  // eslint-disable-next-line react/prop-types
  const { cctvsNotSelected, cctvsSelected, setCCTVsSelectedArray } = props;
  const [url, setUrl] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  const allCCTVs = React.useMemo(() => {
    return [...cctvsNotSelected, ...cctvsSelected]
  }, [cctvsNotSelected, cctvsSelected]);
  // const titleRef = React.useRef('');

  // React.useEffect(() => {
  //   if(checkedCCTVId){
  //     const checkedCCTV = allCCTVs.find(cctv => cctv.cctvId === checkedCCTVId);
  //     if(checkedCCTV){
  //       setUrl(checkedCCTV.url || 'https://localhost');
  //       setTitle(checkedCCTV.title || '');
  //     }
  //   } else {
  //     setUrl('https://-');
  //     setTitle('');
  //   }
  // },[allCCTVs, checkedCCTVId])

  const setPlayer = React.useCallback(() => {
    return null;
  }, []);

  const onChangeUrl = React.useCallback((event) => {
    setUrl(event.target.value);
  }, []);

  const source = React.useMemo(() => {
    return {
      url
    }
  }, [url]);

  const mp4RegExp = /.*\.mp4.*/;
  const isMP4 = mp4RegExp.test(source.url);
  const youtubeRegExtp = /.*youtube.com\/.*/;
  const isYoutube = youtubeRegExtp.test(source.url);

  const setTitleValue = React.useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const onClickAdd = React.useCallback(() => {
    if (title.length === 0 || url.length === 0) {
      setErrorMessage('[ERROR]title or url is empty')
      return;
    }
    const ALREADY_INDEX = allCCTVs.findIndex(cctv => cctv.url === url);
    if (ALREADY_INDEX >= 0) {
      const alreadyCCTV = allCCTVs[ALREADY_INDEX];
      // alert(`URL already exists! - [${alreadyCCTV.title}]`);
      setErrorMessage(`[ERROR]already exists! - [${alreadyCCTV.title}]`);
      return;
    };
    const newCCTV = {
      url,
      title,
      cctvId: Date.now(),
      num: Date.now(),
    };
    setCCTVsSelectedArray([...cctvsSelected, newCCTV]);
    setUrl('');
    setTitle('');
    setErrorMessage(null);
  }, [allCCTVs, url, title, setCCTVsSelectedArray, cctvsSelected]);

  return (
    <Container>
        <Box width="150px">
          {isMP4 ? (
            <MP4Player
              source={source}
              autoRefresh={true}
              setPlayer={setPlayer}
              showTitle={false}
            >
            </MP4Player>
          ): isYoutube ? (
            <YoutubeJSPlayer
              source={source}
              setPlayer={setPlayer}
              showTitle={false}
            >
            </YoutubeJSPlayer>
          ):(
            <HLSJSPlayer
              source={source}
              aspectRatio="16/9"
              fill={true}
              enableOverlay={false}
              setPlayer={setPlayer}
              autoRefresh={false}
              showTitle={false}
            ></HLSJSPlayer>
          )}
        </Box>
        <SubContainer>
          <input placeholder="제목" onChange={setTitleValue} value={title} />
          <input
            style={{ marginTop: '5px' }}
            placeholder="https://-"
            onChange={onChangeUrl}
            value={url}
          />
          <button style={{ marginTop: '5px' }} onClick={onClickAdd}>add url</button>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </SubContainer>
    </Container>
  )
}

export default React.memo(AddManualUrl);
