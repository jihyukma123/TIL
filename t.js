class Barista {
  makeCoffee() {
    console.log("그냥 커피");
  }
}

class Minsu extends Barista {
  makeCoffee() {
    console.log("핸드드립으로 내림");
  }
}

class Jiyoung extends Barista {
  makeCoffee() {
    console.log("머신으로 내림");
  }
}

class Taeho extends Barista {
  makeCoffee() {
    console.log("콜드브루로 내림");
  }
}

class Cacher {
  deliverCoffeeOrder(worker) {
    worker.makeCoffee();
    console.log("커피 제공 완료");
  }
}

// --- 실행 ---
const staff = [new Minsu(), new Jiyoung(), new Taeho()];
const todayWorker = staff[Math.floor(Math.random() * 3)];

const cacher = new Cacher();

cacher.deliverCoffeeOrder(todayWorker);
