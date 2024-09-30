import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Rows = styled.div`
  padding-right: 3px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
  };
  &::-webkit-scrollbar-thumb {
    background-color: black;
  }
  &::-webkit-scrollbar-track {
    background-color: #9b6a2f;
  }
`
const RowContainer = styled.div`
  padding: 3px;
  background-color: black;
  margin-bottom: 3px;
`
const CCTV = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 100;
  color: yellow;
`
const Action = styled.div`
  margin-left: 3px;
`
const Title = styled(Action)`
  color: ${(props) => props.action === 'del' && 'lightgrey'};
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    color: white;
  };
`
const DelButton = styled(Action)`
  color: red;
  margin-left: auto;
  font-weight: 200;
  cursor: pointer;
  &:hover {
    color: white;
  };
`
const TimeStamp = styled(Action)`
  font-size: 10px;
  color: #d73232;
`
const ReloadButton = styled.button`
  margin-bottom: 5px;
`

function HistoryShow(props) {
  // eslint-disable-next-line react/prop-types
  const { setQuickUrl, setQuickTitle } = props;
  const [cctvHistory, setHistory] = React.useState([]);

  React.useEffect(() => {
    window.electron.ipcRenderer.sendMessage('loadHistoryDB');
  }, []);

  const handleLoadDone = React.useCallback((results) => {
    try {
      console.log('load done:', results);
      const cctvHistory = results.map((result) => {
        return {
          ...result,
          json: JSON.parse(result.json_string)
        }
      });
      console.log('cctvHistory:', cctvHistory);
      setHistory(cctvHistory)
    } catch(err) {
      console.error(err);
      setHistory([{ title: 'LOAD ERROR' }]);
    }
  }, []);

  const handleReloadNeeded = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('loadHistoryDB');
  }, []);

  React.useEffect(() => {
    window.electron.ipcRenderer.on('reloadNeeded', handleReloadNeeded);
    window.electron.ipcRenderer.on('loadDone', handleLoadDone);
    return () => {
      window.electron.ipcRenderer.off('reloadNeeded', handleReloadNeeded);
      window.electron.ipcRenderer.off('loadDone', handleLoadDone);
    }
  }, [handleLoadDone, handleReloadNeeded]);

  const reloadHistory = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('loadHistoryDB');
  }, []);

  const handleDelete = React.useCallback((event) => {
    const createDttm = event.target.id;
    window.electron.ipcRenderer.sendMessage('deleteHistory', createDttm);
  }, []);

  const loadInfo = React.useCallback(
    (event) => {
      const createDttm = event.target.id;
      const clickedCCTV = cctvHistory.find(
        (cctv) => cctv.create_dttm === createDttm,
      );
      setQuickUrl(clickedCCTV.json.url);
      setQuickTitle(clickedCCTV.json.title);
    },
    [cctvHistory, setQuickTitle, setQuickUrl],
  );

  return (
    <Container>
      <ReloadButton onClick={reloadHistory}>refresh</ReloadButton>
      <Rows>
        {cctvHistory.map((cctv) => (
          <RowContainer>
            <CCTV key={cctv.create_dttm}>
              {/* <Action>[{cctv.action}]</Action> */}
              <Title
                id={cctv.create_dttm}
                onClick={loadInfo}
                action={cctv.action}
              >
                {cctv.json.title}
              </Title>
              <DelButton id={cctv.create_dttm} onClick={handleDelete}>
                [Del]
              </DelButton>
            </CCTV>
            <TimeStamp>{cctv.create_dttm}</TimeStamp>
          </RowContainer>
        ))}
      </Rows>
    </Container>
  )
}

export default React.memo(HistoryShow);
