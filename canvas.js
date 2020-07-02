let canvas, ctx, result_canvas;

document.addEventListener('DOMContentLoaded',(ev)=>{
    canvas = document.getElementById('canvas');
    result_canvas = document.getElementById('result-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 280;
    // return;
    let imgObj = new Image();
    imgObj.onload = function() {
        let w = canvas.width;
        let nw = imgObj.naturalWidth;
        let nh = imgObj.naturalHeight;
        console.log(nw,nh);
        let aspect = nw / nh; 
        let h = w / aspect;
        canvas.height = h;
        result_canvas.height = h;
        result_canvas.width = w;
        
        // assigning the height to the frame container
        let fix_elem = document.querySelector('.resizable');
        if(fix_elem){
            fix_elem.style.height = h + 'px';
            fix_elem.style.width = w + 'px';
        }
        let bw_elem = document.querySelector('.resizer-bw');
        if(bw_elem){
            bw_elem.style.height = h + 'px';
            bw_elem.style.width = w + 'px';
        }
        makeResizableDiv('.resizable');
        
        ctx.drawImage(imgObj,0,0,w,h);
        // console.log(canvas.toDataURL());
    }
    imgObj.crossOrigin = "Anonymous";
    imgObj.src = 'https://www.gstatic.com/webp/gallery/1.jpg';
    
    // imgObj.src = canvas.toDataURL();
    canvas.addEventListener('click',greycale);
    // drawRect();
}); 

const drawRect = function() {
    ctx.rect(300,100, 100, 50);
     ctx.strokeStyle = 'red';
     ctx.lineWidth = 10;

     ctx.fillStyle = 'skyblue';
     ctx.fill();
     ctx.stroke();
     //depends on the order in which the fill and stroke are called.
}
const greycale = function(ev){
    imgData = ctx.getImageData(0,0,canvas.width, canvas.height);
    let arr = imgData.data;
    for(let i=0; i<arr.length; i=i+4){
        let ttl = arr[i] + arr[i+1] + arr[i+2];
        let avg = parseInt(ttl/3);
        arr[i] = avg;
        arr[i+1] = avg;
        arr[i+2] = avg;
    }
    imgData.data = arr;
    ctx.putImageData(imgData,0,0);
}

function makeResizableDiv(div) {

    const bw_elem = document.querySelector('.resizer-bw');
    const container_elem = document.querySelector(div);

    if(!bw_elem && !container_elem){
        alert("element missing");
        return;
    }
    let initial_left_border = 0;
    
    let ct_width = container_elem.getBoundingClientRect().width;
    let ct_height = container_elem.getBoundingClientRect().height;

    let xa = 2, ya = 1;
    
    bw_x = ct_width;
    bw_y = (ya/xa) * bw_x;

    if(bw_y > ct_height){
      bw_y = ct_height;
      bw_x = (xa/ya) * bw_y;
    }
    initial_border_x = ((ct_width - bw_x)/2);  
    initial_border_y = ((ct_height - bw_y)/2);

    bw_elem.style.borderTopWidth = initial_border_y + 'px';
    bw_elem.style.borderBottomWidth = initial_border_y + 'px';
    bw_elem.style.borderLeftWidth = initial_border_x + 'px';
    bw_elem.style.borderRightWidth = initial_border_x + 'px';

    let min_width = xa * 40;
    let min_height = ya * 40; 
    let initial_Mx = 0;
    let initial_My = 0;
    let initial_x = 0;
    let initial_y = 0;
    let xli = 0, yli = 0, xlf = 0, ylf = 0, x_old = 0, x_new = 0,r_br_updated = 0;

    const element = document.querySelector(div);

    let offset = [0,0];
    element.addEventListener('touchstart',function(e){
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;
        console.log("touch_start");
        if(e.button == 2){
            return;
        }
        initial_left_border = parseFloat(bw_elem.style.borderLeftWidth);
        initial_right_border = parseFloat(bw_elem.style.borderRightWidth);
        initial_top_border = parseFloat(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseFloat(bw_elem.style.borderBottomWidth);

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
        initial_left_border = parseFloat(bw_elem.style.borderLeftWidth);
        initial_right_border = parseFloat(bw_elem.style.borderRightWidth);
        initial_top_border = parseFloat(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseFloat(bw_elem.style.borderBottomWidth);

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
        initial_left_border = parseFloat(bw_elem.style.borderLeftWidth);
        initial_right_border = parseFloat(bw_elem.style.borderRightWidth);
        initial_top_border = parseFloat(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseFloat(bw_elem.style.borderBottomWidth);
        initial_x = (touch && touch.pageX);
        initial_y = (touch && touch.pageY);

        window.addEventListener('touchmove', resize)
        window.addEventListener('touchend', stopResize)
      })

      currentResizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if(e.button == 2){
            return;
        }
        initial_left_border = parseFloat(bw_elem.style.borderLeftWidth);
        initial_right_border = parseFloat(bw_elem.style.borderRightWidth);
        initial_top_border = parseFloat(bw_elem.style.borderTopWidth);
        initial_bottom_border = parseFloat(bw_elem.style.borderBottomWidth);
        initial_x = e.pageX;
        initial_y = e.pageY;
        xli = ct_width - initial_left_border - initial_right_border;
        yli = ct_height - initial_top_border - initial_bottom_border;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
      })
      
      function resize(e) {
        var l_br = parseFloat(bw_elem.style.borderLeftWidth);
        var r_br = parseFloat(bw_elem.style.borderRightWidth);
        var t_br = parseFloat(bw_elem.style.borderTopWidth);
        var b_br = parseFloat(bw_elem.style.borderBottomWidth);
        let touch = e && e.touches && e.touches[0] ?  e.touches[0] : null;0
        window.removeEventListener('touchmove', moveContainer);
        window.removeEventListener('mousemove', moveContainer);

        if (currentResizer.classList.contains('bottom-right')) {          
          x_old = initial_x;
          x_new = (e.pageX || (touch && touch.pageX));
          xlf = xli + (x_new - x_old);
          ylf = (ya/xa) * xlf;

          diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
          threshold_r = ct_width - min_width - (initial_right_border - diff_x) - initial_left_border;
          
          if(initial_right_border - diff_x >= 0 && threshold_r >= 0){
            r_br_updated = (initial_right_border - diff_x);
            b_br_updated = (initial_bottom_border - (ylf - yli));
            if((initial_left_border + xlf) > ct_width || (initial_top_border + ylf) > ct_height){
              if(xa > ya){
                bw_elem.style.borderRightWidth = '0px';      
                bw_elem.style.borderBottomWidth = ct_height - initial_top_border - ((ya/xa)*(ct_width - initial_left_border)) + 'px';
              } else {
                bw_elem.style.borderRightWidth = ct_width - initial_left_border - ((xa/ya)*(ct_height - initial_top_border)) + 'px';      
                bw_elem.style.borderBottomWidth = '0px';      
              }
              return;
            }
            bw_elem.style.borderRightWidth = r_br_updated + 'px';
            bw_elem.style.borderBottomWidth = b_br_updated + 'px';
          } else if(threshold_r >= 0){
              if(xa > ya){
                bw_elem.style.borderRightWidth = '0px';      
                bw_elem.style.borderBottomWidth = ct_height - initial_top_border - ((ya/xa)*(ct_width - initial_left_border)) + 'px';
              } else {
                console.log("Helloo",initial_left_border,ct_height - initial_top_border,((xa/ya)*(ct_height - initial_top_border)));
                bw_elem.style.borderBottomWidth = '0px';
                bw_elem.style.borderRightWidth = ct_width - initial_left_border - ((xa/ya)*(ct_height - initial_top_border)) + 'px';      
              }
              return;
          } else {
            console.log(ct_height, initial_top_border, min_height);
            bw_elem.style.borderBottomWidth = ct_height - initial_top_border - min_height + 'px';
            bw_elem.style.borderRightWidth = ct_width - initial_left_border - min_width + 'px';
          }
        } else if (currentResizer.classList.contains('top-left')) {
          
          x_old = initial_x;
          x_new = (e.pageX || (touch && touch.pageX));
          xlf = xli + (x_old - x_new);
          console.log(xlf,xli);
          ylf = (ya/xa) * xlf;

          diff_x = (e.pageX || (touch && touch.pageX)) - initial_x;
          threshold_x = ct_width - min_width - (initial_left_border + diff_x) - initial_right_border;
          
          let current_left_border = initial_left_border + diff_x;
          
          if(initial_left_border + diff_x >= 0 && current_left_border >= 0 && threshold_x >=0){
          
            l_br_updated = (initial_left_border + diff_x);
            t_br_updated = (initial_top_border - (ylf - yli));
            // console.log(ylf,yli);
            if((initial_right_border + xlf) > ct_width || (initial_bottom_border + ylf) > ct_height){
              if(xa > ya){
                bw_elem.style.borderLeftWidth = '0px';      
                bw_elem.style.borderTopWidth = ct_height - initial_bottom_border - ((ya/xa)*(ct_width - initial_right_border)) + 'px';
              } else {
                bw_elem.style.borderLeftWidth = ct_width - initial_right_border - ((xa/ya)*(ct_height - initial_bottom_border)) + 'px';      
                bw_elem.style.borderTopWidth = '0px';      
              }
              return;
            }
            bw_elem.style.borderLeftWidth = l_br_updated + 'px';
            bw_elem.style.borderTopWidth = t_br_updated + 'px';

          } else if(current_left_border < 0){
            console.log(15);
            if(xa > ya){
              bw_elem.style.borderLeftWidth = '0px';      
              bw_elem.style.borderTopWidth = ct_height - initial_bottom_border - ((ya/xa)*(ct_width - initial_right_border)) + 'px';
            } else {
              console.log("Helloo",initial_left_border,ct_height - initial_top_border,((xa/ya)*(ct_height - initial_top_border)));
              bw_elem.style.borderTopWidth = '0px';
              bw_elem.style.borderLeftWidth = ct_width - initial_right_border - ((xa/ya)*(ct_height - initial_bottom_border)) + 'px';      
            }
            return;
            
              bw_elem.style.borderLeftWidth = '0px';
          } else if(threshold_x < 0){
            console.log(17);
            bw_elem.style.borderLeftWidth = ct_width - initial_right_border - min_width + 'px';
            bw_elem.style.borderTopWidth = ct_height - initial_bottom_border - min_height + 'px';
          }

          // diff_y = (e.pageY || (touch && touch.pageY)) - initial_y;
          // threshold_y = ct_height - min_height - (initial_top_border + diff_y) - initial_bottom_border;
          // let current_top_border = (initial_top_border + diff_y);
          // if(initial_top_border + diff_y >= 0 && threshold_y >= 0 && current_top_border >= 0){
          //   bw_elem.style.borderTopWidth = (initial_top_border + diff_y) + 'px';
          // } else if(threshold_y < 0 && current_top_border >= 0){
          //     bw_elem.style.borderTopWidth = ct_height - initial_bottom_border - min_height + 'px';
          // } else if (current_top_border < 0) {
          //     bw_elem.style.borderTopWidth = '0px';
          // }

        }
        else if (currentResizer.classList.contains('top-right')) {
             
        }

        else if (currentResizer.classList.contains('bottom-left')) {
          
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
        // console.log("move_container");
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

  function cropImage() {
    let li, ri, ti, bi, hi, wi;
    let xo, yo, xc, yc, hc, wc;
    let bw_top, bw_bottom, bw_left, bw_right;

    let crop_elem = document.querySelector('.resizers');
    let result_canvas = document.getElementById('result-canvas');
    let canvas = document.getElementById('canvas');
    
    
    li = crop_elem.getBoundingClientRect().left;
    ri = crop_elem.getBoundingClientRect().right;
    ti = crop_elem.getBoundingClientRect().top;
    bi = crop_elem.getBoundingClientRect().bottom;
    
    lo = canvas.getBoundingClientRect().left;
    ro = canvas.getBoundingClientRect().right;
    to = canvas.getBoundingClientRect().top;
    bo = canvas.getBoundingClientRect().bottom; 

    lc = (li - lo < 0 ? 0 : li - lo);
    rc = (ro - ri < 0 ? 0 : ro - ri);
    tc = (ti - to < 0 ? 0 : ti - to);
    bc = (bo - bi < 0 ? 0 : bo - bi);


    wi = crop_elem.getBoundingClientRect().width;
    hi = crop_elem.getBoundingClientRect().height;

    xi = crop_elem.getBoundingClientRect().x;
    yi = crop_elem.getBoundingClientRect().y;

    xo = canvas.getBoundingClientRect().x;
    yo = canvas.getBoundingClientRect().y;
    xc = (xi - xo < 0 ? 0 : xi - xo);
    yc = (yi - yo < 0 ? 0 : yi - yo); 
    
    ctx = canvas.getContext('2d');

    ctx_r = result_canvas.getContext('2d');
    ctx_r.clearRect(0,0,result_canvas.width, result_canvas.height);

    let canvas_data = ctx.getImageData(xc, yc, wi, hi);

    ctx_r.putImageData(canvas_data, xc, yc);

    // to retain the previous crop
    bw_top = tc;
    bw_bottom = bc;
    bw_left = lc;
    bw_right = rc;
    // console.log(bw_top,bw_right,bw_bottom,bw_left);   
  }