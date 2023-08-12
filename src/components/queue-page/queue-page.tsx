import React, { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import queuePageStyle from './queue-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/types";
import { QueueCircleElement, Position } from "../../types/types";
import { Queue } from "./queue";
import { sleep } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useMemo } from "react";
import { updateElementsWithInterval } from "../../utils/utils";

export const QueuePage: React.FC = () => {
  const [inputString, setInputString] = useState('');
  const [queueLetters, setQueueLetters] = useState<(QueueCircleElement | null)[]>([]);
  const [inProgressAdd, setInProgressAdd] = useState(false);
  const [inProgressDelete, setInProgressDelete] = useState(false);
  const [inProgressClear, setInProgressClear] = useState(false);
  const [isComponentMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Создание массива пустых дефолтных круглых ячеек
  const initialQueue = Array.from({ length: 7 }, () => ({ value: '', state: ElementStates.Default, head: false, tail: false }));

  useEffect(() => {
    setQueueLetters(initialQueue);
  }, []);

  const queue = useMemo(() => new Queue<QueueCircleElement>(7), []);
  let peak = queue.peak();

  const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const newInputString = evt.currentTarget.value;
    setInputString(newInputString);
  };

  // Добавление нового элемента в очередь
  const handleAdd = async () => {
    setInProgressAdd(true);
    setInputString("");
    let tail = queue.getTail();
    if (tail?.value) tail.value.tail = false;
    if (queue.isEmpty()) {
      queue.enqueue({ value: inputString, state: ElementStates.Changing, head: true, tail: true });
    } else {
      queue.enqueue({ value: inputString, state: ElementStates.Changing, head: false, tail: true });
    }
    setQueueLetters([...queue.getElements()])
    await sleep(SHORT_DELAY_IN_MS);
    tail = queue.getTail();
    if (tail?.value) tail.value.state = ElementStates.Default;
    setQueueLetters([...queue.getElements()])
    await sleep(SHORT_DELAY_IN_MS);
    setInProgressAdd(false)
  }

  // Удаление элемента из очереди
  const handleDelete = async () => {
    setInProgressDelete(true);
    let head = queue.getHead();
    let tail = queue.getTail();
    if (!queue.isEmpty() && head?.value && head?.index === 6) { // удаление последненего элемента из массива
      head.value.state = ElementStates.Changing;
      await updateElementsWithInterval(setQueueLetters, [...queue.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);
      head.value.head = true;
      head.value.value = '';
      head.value.tail = false;
      head.value.state = ElementStates.Default;
    }
    if (!queue.isEmpty() && head?.value && head?.index !== 6) { // удаление любого элемента из массива, кроме последнего
      head.value.state = ElementStates.Changing;
      await updateElementsWithInterval(setQueueLetters, [...queue.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);
      head.value.head = false;
      queue.dequeue();
    }
    if (head?.index === tail?.index && head?.index !== 6 && tail?.index !== 6) queue.clear(); // удаление последнего элемента в очереди, не являющимся последним в массиве, возврат к началу очереди

    head = queue.getHead();
    if (!queue.isEmpty() && head?.value) {
      head.value.head = true;
      setQueueLetters([...queue.getElements()]);
    }
    await updateElementsWithInterval(setQueueLetters, [...queue.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);
    if (head?.value) head.value.state = ElementStates.Default;
    setQueueLetters([...queue.getElements()]);

    setInProgressDelete(false)
  }

  // Очистка массива, возврат к исходному состоянию
  const handleClearAll = async () => {
    setInProgressClear(true);

    queue.clear();
    setInputString('');
    queue.container[6] = null;
    await updateElementsWithInterval(setQueueLetters, [...initialQueue], SHORT_DELAY_IN_MS, isComponentMounted);

    setInProgressClear(false);
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={queuePageStyle.wrap}>
        <div className={queuePageStyle.inputButtonsWrap}>
          <Input 
            maxLength={4} 
            isLimitText={true} 
            limitTexteEnd="а"
            value={inputString} 
            onChange={handleInputChange} 
            disabled={inProgressDelete || inProgressClear || inProgressAdd}
          />
        
          <div className={queuePageStyle.addDeleteButtonsWrap}>
            <Button 
              text="Добавить" 
              onClick={handleAdd} 
              type="button"
              isLoader={inProgressAdd} 
              disabled={inProgressDelete || inProgressClear || !inputString || peak?.head === true || peak?.tail === true}
            />
            <Button 
              text="Удалить" 
              type="button" 
              onClick={handleDelete} 
              isLoader={inProgressDelete} 
              disabled={inProgressAdd || inProgressClear || queue.length === 0 || (peak?.head === true && peak?.tail === false)} 
            />
          </div>
        </div>
          <Button 
            text="Очистить" 
            type="button"
            onClick={handleClearAll} 
            isLoader={inProgressClear} 
            disabled={inProgressDelete || inProgressAdd}
          />
      </div>
      <ul className={queuePageStyle.circleWrap}>
        {queueLetters.map((letter, index) => (
          <Circle
            state={letter?.state}
            letter={letter?.value.toString()}
            index={index}
            key={index}
            head={letter?.head ? Position.head : ''}
            tail={letter?.tail ? Position.tail : ''}
          />
        ))}
      </ul>
    </SolutionLayout>
  );
};
