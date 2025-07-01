import React from 'react';
import Binary from './binary';
import Multiclass from './multiclass';
import History from './history/history';
import SuggestionBinary from './suggestionbinary';
import SuggestionMulti from './suggestionmulti';

const IdentifyAi = () => (
  <>
    <h1>Binary</h1>
    <Binary />
    <h1>{'\t'}</h1>
    <h1>Multiclass</h1>
    <Multiclass />
    <History />
    <SuggestionMulti />
    <SuggestionBinary />
  </>
);

export default IdentifyAi;
