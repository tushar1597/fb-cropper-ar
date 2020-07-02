function makeResizableDiv(div) {
    const bw_elem = document.querySelector('.resizer-bw');
    
    let initial_left_border = 0;
    bw_elem.style.borderWidth = "50px";
    bw_elem.style.borderLeftWidth = "40px";
    bw_elem.style.borderRightWidth = "60px";
    let bw_width = bw_elem.getBoundingClientRect().width;
    let bw_height = bw_elem.getBoundingClientRect().height;
    let min_width = 50;
    let min_height = 60; 
    let initial_Mx = 0;
    let initial_My = 0;
    let initial_x = 0;
    let initial_y = 0;
    const element = document.querySelector(div);

    let offset = [0,0];
    element.addEventListener('touchstart',function(e){
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        console.log("touch_start");
        if(e.button == 2){
            return;
        }
        initial_left_border = parseInt(bw_elem.style.borderLeftWidth);
        initial_right_border = parseInt(bw_elem.style.borderRightWidth);
        initial_top_border = parseInt(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseInt(bw_elem.style.borderBottomWidth);

        initial_Mx = e.pageX || (touch && touch.pageX);
        initial_My = e.pageY || (touch && touch.pageY);
        window.addEventListener('touchmove', moveContainer);
        window.addEventListener('touchend', stopContainer)
    })

    element.addEventListener('mousedown',function(e){
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        console.log("touch_start");
        if(e.button == 2){
            return;
        }
        initial_left_border = parseInt(bw_elem.style.borderLeftWidth);
        initial_right_border = parseInt(bw_elem.style.borderRightWidth);
        initial_top_border = parseInt(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseInt(bw_elem.style.borderBottomWidth);

        initial_Mx = e.pageX || (touch && touch.pageX);
        initial_My = e.pageY || (touch && touch.pageY);
        window.addEventListener('mousemove', moveContainer);
        window.addEventListener('mouseup', stopContainer)
    })

    const resizers = document.querySelectorAll(div + ' .resizer')
 
    for (let i = 0;i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('touchstart', function(e) {
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        initial_left_border = parseInt(bw_elem.style.borderLeftWidth);
        initial_right_border = parseInt(bw_elem.style.borderRightWidth);
        initial_top_border = parseInt(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseInt(bw_elem.style.borderBottomWidth);
        initial_x = (touch && touch.pageX);
        initial_y = (touch && touch.pageY);

        window.addEventListener('touchmove', resize)
        window.addEventListener('touchend', stopResize)
      })

      currentResizer.addEventListener('mousedown', function(e) {
        // e.preventDefault();
        if(e.button == 2){
            return;
        }
        initial_left_border = parseInt(bw_elem.style.borderLeftWidth);
        initial_right_border = parseInt(bw_elem.style.borderRightWidth);
        initial_top_border = parseInt(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseInt(bw_elem.style.borderBottomWidth);
        initial_x = e.pageX;
        initial_y = e.pageY;

        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
      })
      
      function resize(e) {
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        window.removeEventListener('touchmove', moveContainer);
        window.removeEventListener('mousemove', moveContainer);
        if (currentResizer.classList.contains('bottom-right')) {
          diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
          threshold_r = bw_width - min_width - (initial_right_border - diff_x) - initial_left_border;
          if(initial_right_border - diff_x >= 0 && threshold_r >= 0){
            bw_elem.style.borderRightWidth = (initial_right_border - diff_x) + 'px';
          } else if(threshold_r >= 0){
            bw_elem.style.borderRightWidth = '0px';
          } else {
            bw_elem.style.borderRightWidth = bw_width - initial_left_border - min_width + 'px';
          }

          diff_y = (e.pageY || (touch &&touch.pageY)) - initial_y;
          threshold_y = bw_height - min_height - (initial_bottom_border - diff_y) - initial_top_border;
          if(initial_bottom_border - diff_y >= 0 && threshold_y >= 0){
            bw_elem.style.borderBottomWidth = (initial_bottom_border - diff_y) + 'px';
          } else if(threshold_y >= 0){
            bw_elem.style.borderBottomWidth = '0px';
          } else {
            bw_elem.style.borderBottomWidth = bw_height- initial_top_border - min_height + 'px';
          }
        } else if (currentResizer.classList.contains('top-left')) {
            diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
            threshold_x = bw_width - min_width - (initial_left_border + diff_x) - initial_right_border;
            let current_left_border = initial_left_border + diff_x;
            if(initial_left_border + diff_x >= 0 && current_left_border >= 0 && threshold_x >=0){
              bw_elem.style.borderLeftWidth = (initial_left_border + diff_x) + 'px';
            } else if(current_left_border < 0){
                bw_elem.style.borderLeftWidth = '0px';
            } else if(threshold_x < 0){
                bw_elem.style.borderLeftWidth = bw_width - initial_right_border - min_width + 'px';
            }
  
            diff_y = (e.pageY || (touch && touch.pageY)) - initial_y;
            threshold_y = bw_height - min_height - (initial_top_border + diff_y) - initial_bottom_border;
            let current_top_border = (initial_top_border + diff_y);
            if(initial_top_border + diff_y >= 0 && threshold_y >= 0 && current_top_border >= 0){
              bw_elem.style.borderTopWidth = (initial_top_border + diff_y) + 'px';
            } else if(threshold_y < 0 && current_top_border >= 0){
                bw_elem.style.borderTopWidth = bw_height - initial_bottom_border - min_height + 'px';
            } else if (current_top_border < 0) {
                bw_elem.style.borderTopWidth = '0px';
            }
          }
        
        else if (currentResizer.classList.contains('top-right')) {
            diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
            threshold_r = bw_width - min_width - (initial_right_border - diff_x) - initial_left_border;
            if(initial_right_border - diff_x >= 0 && threshold_r >= 0){
              bw_elem.style.borderRightWidth = (initial_right_border - diff_x) + 'px';
            } else if(threshold_r >= 0){
              bw_elem.style.borderRightWidth = '0px';
            } else {
              bw_elem.style.borderRightWidth = bw_width - initial_left_border - min_width + 'px';
            }
            diff_y = (e.pageY || (touch && touch.pageY)) - initial_y;
            threshold_y = bw_height - min_height - (initial_top_border + diff_y) - initial_bottom_border;
            let current_top_border = (initial_top_border + diff_y);
            if(initial_top_border + diff_y >= 0 && threshold_y >= 0 && current_top_border >= 0){
              bw_elem.style.borderTopWidth = (initial_top_border + diff_y) + 'px';
            } else if(threshold_y < 0 && current_top_border >= 0){
                bw_elem.style.borderTopWidth = bw_height - initial_bottom_border - min_height + 'px';
            } else if (current_top_border < 0) {
                bw_elem.style.borderTopWidth = '0px';
            } 
        }

        else if (currentResizer.classList.contains('bottom-left')) {
            diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
            threshold_x = bw_width - min_width - (initial_left_border + diff_x) - initial_right_border;
            let current_left_border = initial_left_border + diff_x;
            if(initial_left_border + diff_x >= 0 && current_left_border >= 0 && threshold_x >=0){
              bw_elem.style.borderLeftWidth = (initial_left_border + diff_x) + 'px';
            } else if(current_left_border < 0){
                bw_elem.style.borderLeftWidth = '0px';
            } else if(threshold_x < 0){
                bw_elem.style.borderLeftWidth = bw_width - initial_right_border - min_width + 'px';
            }
            diff_y = (e.pageY || (touch && touch.pageY)) - initial_y;
          threshold_y = bw_height - min_height - (initial_bottom_border - diff_y) - initial_top_border;
          if(initial_bottom_border - diff_y >= 0 && threshold_y >= 0){
            bw_elem.style.borderBottomWidth = (initial_bottom_border - diff_y) + 'px';
          } else if(threshold_y >= 0){
            bw_elem.style.borderBottomWidth = '0px';
          } else {
            bw_elem.style.borderBottomWidth = bw_height- initial_top_border - min_height + 'px';
          }
        }
      }
      
      function stopResize() {
        window.removeEventListener('touchmove', resize);
        window.removeEventListener('mousemove', resize);
      }
    }

    function moveContainer(e) {
        // e.preventDefault();
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        console.log("move_container");
        let move_x = (e.pageX || (touch && touch.pageX)) - initial_Mx;
        let move_y = (e.pageY || (touch && touch.pageY)) - initial_My;

        if(initial_left_border + move_x >= 0 && initial_right_border - move_x >=0){
            bw_elem.style.borderLeftWidth = initial_left_border + move_x + 'px';
            bw_elem.style.borderRightWidth = initial_right_border - move_x + 'px'; 
        } else {
            if(initial_left_border + move_x < 0){
                bw_elem.style.borderLeftWidth = '0px';
                bw_elem.style.borderRightWidth = initial_right_border + initial_left_border + 'px';
            } else if(initial_right_border - move_x < 0) {
                bw_elem.style.borderLeftWidth = initial_right_border + initial_left_border + 'px';
                bw_elem.style.borderRightWidth = '0px';
            } 
        }

        if(initial_bottom_border - move_y >= 0 && initial_top_border + move_y >=0){
            bw_elem.style.borderBottomWidth = initial_bottom_border - move_y + 'px';
            bw_elem.style.borderTopWidth = initial_top_border + move_y + 'px'; 
        } 
        else {
            if(initial_top_border + move_y < 0){
                bw_elem.style.borderTopWidth = '0px';
                bw_elem.style.borderBottomWidth = initial_top_border + initial_bottom_border + 'px';
            } else if(initial_bottom_border - move_y < 0) {
                bw_elem.style.borderTopWidth = initial_top_border + initial_bottom_border + 'px';
                bw_elem.style.borderBottomWidth = '0px';
            } 
        }        
    }
    function stopContainer(){
        window.removeEventListener('mousemove', moveContainer)
        window.removeEventListener('touchmove', moveContainer)
    }
  }
  makeResizableDiv('.resizable')


  //         diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
  //         threshold_r = ct_width - min_width - (initial_right_border - diff_x) - initial_left_border;
  //         if(initial_right_border - diff_x >= 0 && threshold_r >= 0){
  //           bw_elem.style.borderRightWidth = (initial_right_border - diff_x) + 'px';
  //         } else if(threshold_r >= 0){
  //           bw_elem.style.borderRightWidth = '0px';
  //         } else {
  //           bw_elem.style.borderRightWidth = ct_width - initial_left_border - min_width + 'px';
  //         }

  //         diff_y = (e.pageY || (touch &&touch.pageY)) - initial_y;
  //         threshold_y = ct_height - min_height - (initial_bottom_border - diff_y) - initial_top_border;
  //         if(initial_bottom_border - diff_y >= 0 && threshold_y >= 0){
  //           bw_elem.style.borderBottomWidth = (initial_bottom_border - diff_y) + 'px';
  //         } else if(threshold_y >= 0){
  //           bw_elem.style.borderBottomWidth = '0px';
  //         } else {
  //           bw_elem.style.borderBottomWidth = ct_height- initial_top_border - min_height + 'px';
  //         }
