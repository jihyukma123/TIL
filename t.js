// 다양한 제약조건이 있는 subarray를 구하는 종류의 문제를 풀기 위해서 기본적으로 필요한 접근법

// 이중 for문으로 모든 부분배열 구하기
function getAllSubArrays(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    // 이번 요소로 시작하는 부분배열 저장할 배열
    const tempSubArray = [];

    for (let j = i; j < arr.length; j++) {
      // 부분배열에 요소 추가
      tempSubArray.push(arr[j]);

      // 해당 시점 부분배열 저장
      result.push([...tempSubArray]);
    }
  }

  return result;
}

// 713. SubArray product less than K
// var numSubarrayProductLessThanK = function (nums, k) {
//   // 이중 for문을 이용한 풀이 시도
//   let answer = 0;

//   for (let i = 0; i < nums.length; i++) {
//     let product = 1; // 곱을 구하는 문제

//     for (let j = i; j < nums.length; j++) {
//       product = nums[j] * product;
//       if (product < k) {
//         answer++;
//       } else {
//         break;
//       }
//     }
//   }

//   return answer;
// };

var numSubarrayProductLessThanK = function (nums, k) {
  // sliding window 기법을 활용한 풀이
  let subArrayCount = 0;

  let left = 0;
  let right = 0;

  let product = 1;

  while (right < nums.length) {
    // 곱한다.
    product = product * nums[right];

    // 만약에 값이 초과했으면, 처리한다.
  }
};
