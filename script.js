'use strict';
const main=document.querySelector('.main');
const selection=document.querySelector('.selection');
const title=document.querySelector('.main__title');

const getData=()=>{
  const dataBase=[
    {
      id:'01',
      theme:'Тема 1',
      result:[
        [40,'Есть задатки, нужно развиваться'],
        [80,'Очень хорошо, но есть пробелы'],
        [100,'Отличный результат']
      ],
      list:[
        {
          type:'checkbox',
          question:'вопрос 1-1',
          answers:['правильный1', 'правильный2', 'неправильный', 'неправильный'],
          correct:'2'
        },
        {
          type:'checkbox',
          question:'вопрос 2-1',
          answers:['правильный1', 'правильный2', 'неправильный', 'неправильный'],
          correct:'2'
        },
        {
          type:'radio',
          question:'вопрос 3-1',
          answers:["правильный", "неправильный", "неправильный", "неправильный"]
        },
        {
          type:'radio',
          question:'вопрос 4-1',
          answers:["правильный", "неправильный", "неправильный", "неправильный"],
        },
        {
          type:'radio',
          question:'вопрос 5-1',
          answers:["правильный", "неправильный", "неправильный", "неправильный"]
        },
        {
          type:'checkbox',
          question:'вопрос 6-1',
          answers:['правильный1', 'правильный2', 'правильный3', 'неправильный'],
          correct:'3'
        },

      ]
    },
    {
      id:'02',
      theme:'Тема 2',
      result:[
        [40,'Есть задатки, нужно развиваться'],
        [80,'Очень хорошо, но есть пробелы'],
        [100,'Отличный результат']
      ],
      list:[
        {
          type:'radio',
          question:'вопрос 1-2',
          answers:["правильный", "неправильный", "неправильный", "неправильный"]
        },
        {
          type:'checkbox',
          question:'вопрос 2-2',
          answers:["правильный1", "правильный2", "неправильный", "неправильный"],
          correct:'2'
        },
        {
          type:'checkbox',
          question:'вопрос 3-2',
          answers:["правильный1", "правильный2", "неправильный","неправильный"],
          correct:'2'
        },
        
        {
          type:'checkbox',
          question:'вопрос 4-2',
          answers:["правильный1", "правильный2", "правильный3", "неправильный"],
          correct:'3'
        },
        {
          type:'radio',
          question:'вопрос 5-2',
          answers:["правильный", "неправильный", "неправильный", "неправильный"]
        },
        
      ]
    }
  ];
  return dataBase;
};
const hideElem=elem=>{
  let opacity=getComputedStyle(elem).getPropertyValue('opacity');
  const animation=()=>{
    opacity-=0.05;
    elem.style.opacity=opacity;
    if (opacity>0){
      requestAnimationFrame(animation)
    } else{
      elem.style.display='none';
    }
  };
  requestAnimationFrame(animation);
};
const renderTheme=themes=>{
  const list=document.querySelector('.selection__list');
  list.textContent='';
  const buttons=[];

  for(let i=0;i<themes.length;i+=1){
    const li=document.createElement('li');
    li.className='selection__item';
    const button=document.createElement('button');
    button.className="selection__theme";
    button.dataset.id=themes[i].id;
    button.textContent=themes[i].theme;
    li.append(button);

    // const result=loadResult(themes[i].id);
    // if (result){
    //   const p=document.createElement('p');
    //   p.className='selection__result';
    //   p.innerHTML=`
    //     <span class="selection__result-ratio">${result}/${themes[i].list.length}</span>
    //     <span class="selection__result-text">Последний результат</span>
    //   `;
    //   li.append(p);
    // }
    
    list.append(li);
    buttons.push(button);
  }
  return(buttons);
};
const shuffle=array=>{
  const newArray=[...array];
  for(let i=newArray.length-1; i>0; i-=1){
    let j=Math.floor(Math.random()*(i+1));
    [newArray[i], newArray[j]]=[newArray[j], newArray[i]];
  }
  return newArray;
};

const createKeyAnswers=data=>{
  const keys=[];
  for(let i=0; i<data.answers.length;i++){
    if (data.type==='radio'){
      keys.push([data.answers[i], !i]);
    }else{
      keys.push([data.answers[i], i<data.correct]);
    }
  }
  return shuffle(keys);
};
const createAnswer=data=>{
  const type=data.type;
  const answers=createKeyAnswers(data);
  return answers.map(item=>{
    const label=document.createElement('label');
    label.className='answer';
    const input=document.createElement('input');
    input.type=type;
    input.name='answer';
    input.className=`answer__${type}`;
    const text=document.createTextNode(item[0]);
    label.append(input, text);
    return label;
  });
};
const renderQuiz=quiz=>{
  hideElem(title);
  hideElem(selection);
  const questionBox=document.createElement('div');
  questionBox.className='main__box main__box_question';
  main.append(questionBox);

  let questionCount=0;

  const showQuestion=()=>{
    const data=quiz.list[questionCount];
    questionCount+=1;

    questionBox.textContent='';
    const form=document.createElement('form');
    form.className='main__form_question';
    form.dataset.count=`${questionCount}/${quiz.list.length}`;
    const fieldset=document.createElement('fieldset');
    const legend=document.createElement('legend');
    legend.className='main__subtitle';
    legend.textContent=data.question;

    const answers=createAnswer(data);

    const button=document.createElement('button');
    button.className='main__btn question__next';
    button.type='submit';
    button.textContent='Подтвердить';
    fieldset.append(legend, ...answers);
    form.append(fieldset, button);
    questionBox.append(form);

    form.addEventListener('submit',(event)=>{
      event.preventDefault();
      let ok=false;
      const answer=[...form.answer].map(input=>{
        if(input.checked) ok=true;
        return input.checked ? input.value : false;
      });
      if (ok){
        console.log(answer);
        if (questionCount<quiz.list.length){showQuestion();}
          else {showResult();}
      }else{
        console.error('не выбран ни один ответ');
        form.classList.add('main__form_question_error');
        setTimeout(()=>{
          form.classList.remove('main__form_question_error');
        },1000);
      }
    });
  }; 
  showQuestion();


};
const addClick=(buttons, data)=>{

  buttons.forEach( btn => {
    btn.addEventListener('click', ()=>{
      const quiz=data.find(item=>item.id===btn.dataset.id);
      renderQuiz(quiz);
    });
  });

};
const initQuiz=()=>{
  const data=getData();
  const buttons= renderTheme(data);
  addClick(buttons, data);
};
initQuiz();