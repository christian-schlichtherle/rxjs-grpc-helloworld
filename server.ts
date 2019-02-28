import {Observable, of, timer} from 'rxjs';
import {mapTo, take} from 'rxjs/operators'
import {serverBuilder} from 'rxjs-grpc';
import {helloworld} from './grpc-namespaces';

async function main() {

    type HelloRequest = helloworld.HelloRequest;
    type HelloReply = helloworld.HelloReply;
    type MultiHelloRequest = helloworld.MultiHelloRequest;
    type ServerBuilder = helloworld.ServerBuilder;

    const server = serverBuilder<ServerBuilder>('helloworld.proto', 'helloworld');

    server.addGreeter({

        sayHello(request: HelloRequest): Observable<HelloReply> {
            return of({
                message: 'Hello ' + request.name
            });
        },

        sayMultiHello(request: MultiHelloRequest): Observable<HelloReply> {
            return timer(100, 500).pipe(
                mapTo({message: `Hello ${request.name}`}),
                take(request.num_greetings)
            );
        }
    });

    server.start('0.0.0.0:50051');
}

main().catch(error => console.error(error));
