//  "./About.css";
import Icon from "~/styleworks/components/Icon";
import { question_circle } from "~/icons";

const x_large = <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>



declare const __BUILD_INFO__: {
  name: string;
  version: string;
  commitHash: string;
  commitShort: string;
  commitTime: string;
  branch: string;
  isDirty: boolean;
  lastTag: string;
  commitsSinceTag: number;
  buildTime: string;
};

interface AboutProps {
    class? : string;
}

function closeDialog(e : HTMLDialogElement) {
    e.close();
}

function openDialog(e : HTMLDialogElement) {
    e.showModal();
}

export default function About(props : AboutProps) {

    let dialogRef! : HTMLDialogElement;

    const {version, commitHash, isDirty, branch, buildTime} = __BUILD_INFO__;

    const timestamp = buildTime.substring(0, buildTime.length - 5) + 'Z';

    return (
        <>
            <button class={["bare-btn  ", props.class]} onClick={()=>openDialog(dialogRef)}><Icon icon={question_circle} size="1.25em"/></button>
            <dialog class="about-dialog" ref={(e) => (dialogRef = e)} onClose={()=>closeDialog(dialogRef)}>
                    <header class="d-flex justify-content-between fs-6">
                        <span class="fs-5 fw-bold">About <span class="txt-brand">Composer Timeline</span></span>
                        <button class="dialog-close" onClick={() => closeDialog(dialogRef)}><Icon class="about-closer" size={"1.2em"} icon={x_large} /></button>
                    </header>
                    <div class="fs-7 mb-2">Cool Thing&trade; I built.</div>
                    <table class="table about-table vrnt-brand txt-left">
                        <tbody>
                            <tr><th>Version</th><td>{version}</td></tr>
                            <tr><th>Commit</th><td>{(commitHash.substring(0, 10)) + (isDirty?'+':'')}</td></tr>
                            <tr><th>Branch</th><td>{branch}</td></tr>
                            <tr><th>Build Time</th><td>{timestamp}</td></tr>
                        </tbody>
                    </table>
            </dialog>
        </>
    );
}