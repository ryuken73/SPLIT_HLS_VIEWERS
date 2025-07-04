/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';
import HLSJSPlayer from './HLSJSPlayer';
import MP4Player from './MP4Player';
import YoutubeJSPlayer from './YoutubeJSPlayer';
import { replace } from './lib/arrayUtil';

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
const Buttons = styled.div`
  display: flex;
  margin-top: 5px;
`
const ErrorMessage = styled.div`
  margin-top: 5px;
  font-size: 12px;
`;

function QuickAddUrl(props) {
  // eslint-disable-next-line react/prop-types
  const {
    quickUrl: url,
    setQuickUrl: setUrl,
    quickTitle: title,
    setQuickTitle: setTitle,
    cctvsNotSelected,
    cctvsSelected,
    setCCTVsSelectedArray,
    setNumberOfResets,
  } = props;
  // const [url, setUrl] = React.useState('');
  // const [title, setTitle] = React.useState('');
  const [centerName, setCenterName] = React.useState('');
  const [idFromITS, setIdFromITS] = React.useState('');
  const [location, setLocation] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState(null);

  const allCCTVs = React.useMemo(() => {
    return [...cctvsNotSelected, ...cctvsSelected];
  }, [cctvsNotSelected, cctvsSelected]);

  const setPlayer = React.useCallback(() => {
    return null;
  }, []);

  const onChangeUrl = React.useCallback((event) => {
    setUrl(event.target.value);
    },
    [setUrl],
  );

  const source = React.useMemo(() => {
    return {
      url,
    };
  }, [url]);

  const mp4RegExp = /.*\.mp4.*/;
  const isMP4 = mp4RegExp.test(source.url);
  const youtubeRegExtp = /.*youtube.com\/.*/;
  const isYoutube = youtubeRegExtp.test(source.url);

  const setTitleValue = React.useCallback((event) => {
      setTitle(event.target.value);
    },
    [setTitle],
  );

  const onClickClear = React.useCallback(() => {
    setTitle('');
    setUrl('');
  }, [setTitle, setUrl]);

  const onClickAdd = React.useCallback((e) => {
    const {id} = e.target;
    if (title.length === 0 || url.length === 0) {
      setErrorMessage('[ERROR]title or url is empty');
      return;
    }
    const ALREADY_INDEX = allCCTVs.findIndex((cctv) => cctv.url === url);
    if (ALREADY_INDEX >= 0) {
      const alreadyCCTV = allCCTVs[ALREADY_INDEX];
      // alert(`URL already exists! - [${alreadyCCTV.title}]`);
      // setErrorMessage(`[ERROR]already exists! - [${alreadyCCTV.title}]`);
      setErrorMessage(`[ERROR]already exists!`);
      setTimeout(() => {
        setErrorMessage('');
        setTitle('');
        setUrl('');
      }, 2000);
      return;
    }
    const newCCTV = {
      url,
      title,
      cctvId: Date.now(),
      idFromITS,
      centerName,
      location,
      num: Date.now(),
      type: id
    };
    // setCCTVsSelectedArray([...cctvsSelected, newCCTV]);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setCCTVsSelectedArray((cctvsSelected) => {
      return [...cctvsSelected, newCCTV]
    });
    setNumberOfResets((numberOfResets) => {
      return [...numberOfResets, 0];
    });
    setUrl('');
    setTitle('');
    setCenterName('');
    setIdFromITS('');
    setLocation(null);
    setErrorMessage(null);
    window.electron.ipcRenderer.sendMessage(
      'addHistoryDB',
      'add',
      JSON.stringify(newCCTV),
    );
    console.log('length:',cctvsSelected.length);
    },
    [
      title,
      url,
      allCCTVs,
      centerName,
      location,
      idFromITS,
      setCCTVsSelectedArray,
      setNumberOfResets,
      setUrl,
      setTitle,
      cctvsSelected.length,
    ],
  );

  const onDrop = React.useCallback((e) => {
    console.log(e)
    const data = e.dataTransfer.getData('text/plain');
    try {
      const jsonData = JSON.parse(data);
      const {cctv_id, cctv_name, cctv_url, center_name, xcoord, ycoord} = jsonData;
      setTitle(cctv_name)
      setUrl(cctv_url)
      setCenterName(center_name)
      setLocation({xcoord, ycoord})
      setIdFromITS(cctv_id)
    } catch (err) {
      console.error(err);
    }
    },
    [setTitle, setUrl],
  );

  const onDragOver = React.useCallback((e) => {
    e.preventDefault();
  }, [])


  console.log('url, title', url, title)
  const addButtonDisabled = url.trim() === '' || title.trim() === '';
  const clearButtonDisabled = url.trim() === '' && title.trim() === '';

  return (
    <Container 
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Box width="150px">
        {isMP4 ? (
          <MP4Player
            source={source}
            autoRefresh
            setPlayer={setPlayer}
            showTitle={false}
          />
        ) : isYoutube ? (
          <YoutubeJSPlayer
            source={source}
            setPlayer={setPlayer}
            showTitle={false}
          />
        ) : (
          <HLSJSPlayer
            source={source}
            aspectRatio="16/9"
            fill
            enableOverlay={false}
            setPlayer={setPlayer}
            autoRefresh={false}
            showTitle={false}
          />
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
        <Buttons>
          <button
            id="stream"
            disabled={addButtonDisabled}
            onClick={onClickAdd}
            style={{width: '100%'}}
          >
            video+
          </button>
          <button
            id="web"
            disabled={addButtonDisabled}
            onClick={onClickAdd}
            style={{width: '100%'}}
          >
           web+
          </button>
          <button
            onClick={onClickClear}
            disabled={clearButtonDisabled}
          >clear</button>
        </Buttons>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </SubContainer>
    </Container>
  );
}

export default React.memo(QuickAddUrl);
