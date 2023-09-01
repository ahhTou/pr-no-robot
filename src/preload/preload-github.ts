// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, timeout);
  });
}

function getIDOfPR(url: string): string | null {
  const reg = /https:\/\/github.com\/SplashtopInc\/sep\/pull\/([0-9]*)/;
  const res = url.match(reg);

  if (typeof res[1] === 'string') {
    return res[1];
  }

  return null;
}

function getApprovalRadio() {
  const query = '.form-checkbox.mx-3.my-2 input';
  const element = document.querySelector(query) as HTMLInputElement;

  return element;
}

function getReviewChangesButton() {
  const query = '.btn.btn-sm.btn-primary.js-reviews-toggle';
  const element = document.querySelector(query) as HTMLDetailsElement;

  return element;
}

function getSubmitReviewButton() {
  const query = '.Button--primary.Button--small.Button.float-left.mr-1';
  const element = document.querySelector(query) as HTMLButtonElement;

  return element;
}

function isPRFilesPage(url: string) {
  const reg = /https:\/\/github.com\/SplashtopInc\/sep\/pull\/[0-9].*?\/files/;

  return reg.test(url);
}

async function start() {
  if (isPRFilesPage(window.location.href)) {
    console.log('BINGO~');

    const id = getIDOfPR(window.location.href);

    console.log(id);

    let $button = getReviewChangesButton();

    while (!$button) {
      $button = getReviewChangesButton();

      await wait(100);
    }

    $button.click();

    await wait(300);

    const $radio = getApprovalRadio();

    $radio.click();

    await wait(300);

    const $submit = getSubmitReviewButton();

    $submit.click();
  }
}

window.onload = async () => {
  start();

  let preHref = window.location.href;

  setInterval(() => {
    const curHref = window.location.href;

    if (curHref !== preHref) {
      preHref = curHref;

      start();
    }
  }, 300);
};
