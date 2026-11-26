import './App.scss';
import About from '~/components/About';
import Timeline from '~/components/Timeline';
import { load } from 'js-yaml';
const MAX_WIDTH = 2000;

import data_string from './data.yml?raw';
import { parse_data } from '~/components/tl_types';
import { createMemo } from 'solid-js';

export default function App() {

  const tl_data = createMemo(() => {
    const data : any = load(data_string);
    return parse_data(data);
  });

  return (<>
    <header class="d-flex vrnt-brand justify-content-between mb-3 pt-1">
      <div class="d-inline-block ms-2">&nbsp;</div>
      <div class="d-inline-block fw-bold fs-5">Timeline</div>
      <div class="d-flex align-items-center me-2"><About /></div>
    </header>
    <main class="tl-parent">
      <Timeline data={tl_data()} width={MAX_WIDTH} />
    </main>
  </>);
}
