import React from 'react';
import styled from 'styled-components';
import MiniSearch from 'minisearch';
import HistoryShowButtons from './HistoryShowButtons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const FilterTitle = styled.input`
  margin-bottom: 5px;
`
const Rows = styled.div`
  height: 100%;
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
const HistoryCount = styled.div`
  font-size: 12px;
  margin-top: auto;
  padding: 5px;
  color: yellow;
  font-weight: 200;
`

const SEARCH_OPTION = {
  prefix: true,
  fields: ['title'],
}

function HistoryShow(props) {
  // eslint-disable-next-line react/prop-types
  const { setQuickUrl, setQuickTitle } = props;
  const [cctvHistory, setHistory] = React.useState([]);
  const [cctvHistoryFiltered, setHistoryFiltered] = React.useState([]);
  const [currentDateUnit, setCurrentDateUnit] = React.useState('M');
  const miniSearchRef = React.useRef(null);
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    // window.electron.ipcRenderer.sendMessage('loadHistoryDB');
    window.electron.ipcRenderer.sendMessage('loadHistoryByUnit', 'M');
  }, []);

  const handleLoadDone = React.useCallback((results) => {
    try { 
      console.log('load done:', results);
      const cctvHistory = results.map((result) => {
        const jsonParsed = JSON.parse(result.json_string);
        return {
          ...result,
          title: jsonParsed.title,
          json: jsonParsed
        }
      });
      console.log('cctvHistory:', cctvHistory);
      setHistory(cctvHistory)
      miniSearchRef.current = new MiniSearch({
        // fields: ['json.title'],
        fields: ['title'],
        storeFields: ['create_dttm', 'action', 'json', 'json_string'],
        idField: 'create_dttm',
      });
      miniSearchRef.current.addAll(cctvHistory);
      const searchPattern = filterRef.current.value.trim() || MiniSearch.wildcard;
      const filteredHistory = miniSearchRef.current.search(
        searchPattern,
        SEARCH_OPTION,
      );
      setHistoryFiltered(filteredHistory);
    } catch(err) {
      console.error(err);
      setHistory([{ title: 'LOAD ERROR' }]);
    }
  }, []);

  const handleReloadNeeded = React.useCallback(() => {
    // window.electron.ipcRenderer.sendMessage('loadHistoryDB');
    window.electron.ipcRenderer.sendMessage(
      'loadHistoryByUnit',
      currentDateUnit,
    );
  }, [currentDateUnit]);

  React.useEffect(() => {
    window.electron.ipcRenderer.on('reloadNeeded', handleReloadNeeded);
    window.electron.ipcRenderer.on('loadDone', handleLoadDone);
    return () => {
      window.electron.ipcRenderer.off('reloadNeeded', handleReloadNeeded);
      window.electron.ipcRenderer.off('loadDone', handleLoadDone);
    }
  }, [handleLoadDone, handleReloadNeeded]);

  const reloadHistory = React.useCallback((event) => {
    const unit = event.target.id;
    window.electron.ipcRenderer.sendMessage('loadHistoryByUnit', unit);
    setCurrentDateUnit(unit);
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
  const handleKeyUp = React.useCallback((event) => {
    const filterKeyword = event.target.value;
    const searchPattern = filterKeyword.trim() || MiniSearch.wildcard;
    const searchResults = miniSearchRef.current.search(
      searchPattern,
      SEARCH_OPTION,
    );
    // const result = miniSearchRef.current.search(MiniSearch.wildcard);
    console.log(searchResults)
    setHistoryFiltered(searchResults)
  }, []);

  return (
    <Container>
      <FilterTitle ref={filterRef} placeholder="search" onKeyUp={handleKeyUp} />
      <HistoryShowButtons
        currentDateUnit={currentDateUnit}
        reloadHistory={reloadHistory}
      />
      <Rows>
        {cctvHistoryFiltered.map((cctv) => (
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
      <HistoryCount>
        {cctvHistory.length} selected [{cctvHistoryFiltered.length} searched]
      </HistoryCount>
    </Container>
  )
}

export default React.memo(HistoryShow);
