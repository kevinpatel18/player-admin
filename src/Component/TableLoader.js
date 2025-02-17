import React from "react";

const TableLoader = () => {
  return (
    <div class="container">
      <div class="skeleton-loader">
        <div class="skeleton-header">
          <div class="skeleton-header-left anim"></div>
          <div class="skeleton-header-right anim"></div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-body-header anim"></div>
          <div class="skeleton-body-content">
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
            <div class="skeleton-row anim"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLoader;
