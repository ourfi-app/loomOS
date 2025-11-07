'use client';

import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { actions, query, connectors } = useEditor();
  const { setSelectedNode } = useBuilderStore();

  const {
    isActive,
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isActive: node.events.selected,
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add('component-selected');
      else dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;
    if (!currentDOM) return;
    const { top, left } = getPos(dom as HTMLElement);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const renderer = document.querySelector('.craftjs-renderer');
    renderer?.addEventListener('scroll', scroll);

    return () => {
      renderer?.removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  return (
    <>
      {isHover || isActive ? (
        <div
          ref={currentRef}
          className={cn(
            'fixed pointer-events-none z-50 transition-all',
            isActive && 'ring-2 ring-loomos-orange',
            isHover && !isActive && 'ring-2 ring-blue-400'
          )}
          style={{
            left: getPos(dom as HTMLElement).left,
            top: getPos(dom as HTMLElement).top,
            zIndex: 9999,
          }}
        >
          <div
            className={cn(
              'absolute -top-7 left-0 px-2 py-1 text-xs font-medium rounded-t',
              'bg-loomos-orange text-white shadow-lg',
              isHover && !isActive && 'bg-blue-400'
            )}
          >
            {name}
          </div>
        </div>
      ) : null}
      {render}
    </>
  );
};
