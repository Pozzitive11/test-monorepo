import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'bucketPipe',
  standalone: true
})
export class BucketPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let buckets = value.match(/\d+/g)
    if (buckets == null)
      return value
    if (buckets.length === 2) {
      let lowBucket = this.formatBucketNumber(buckets[0])
      let topBucket = this.formatBucketNumber(buckets[1])
      return `${lowBucket}\u00A0-\u00A0${topBucket}`
    } else {
      let lowBucket = this.formatBucketNumber(buckets[0])
      return value.replace(/\d+/g, lowBucket)
    }
  }

  private formatBucketNumber(bucket: string): string {
    let new_text: string = ''
    let i: number = 0
    for (let digit of bucket) {
      if ((bucket.length - i) % 3 === 0)
        new_text += '\u00A0'
      new_text += digit
      i++
    }
    return new_text.trim()
  }

}
