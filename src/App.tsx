import './App.scss';
import About from '~/components/About';

export default function App() {

  return (
    <header class="d-flex vrnt-brand justify-content-between mb-3 pt-1">
      <div class="d-inline-block ms-2">&nbsp;</div>
      <div class="d-inline-block fw-bold fs-5">Timeline</div>
      <div class="d-flex align-items-center me-2"><About /></div>
    </header>
  );
}
